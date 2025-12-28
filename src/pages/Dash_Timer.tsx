import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { 
  Play, Pause, RotateCcw, Coffee, Palmtree, Brain, CheckCircle2, Menu
} from "lucide-react";
// Pastikan path ini sesuai
import { Sidebar } from "@/components/section/sidebar";
import { useTimerSettings } from "@/context/TimerContext";

// --- Types ---
type Mission = {
  id: string;
  title: string;
  is_completed: boolean;
};

type TimerMode = 'focus' | 'short' | 'long';

export default function DashboardTimer() {
  const [session, setSession] = useState<Session | null>(null);
  
  // get setting dari context
  const { settings } = useTimerSettings();
  
  const [mode, setMode] = useState<TimerMode>('focus');
  // Inisialisasi awal menggunakan data settings
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60);
  const [isActive, setIsActive] = useState(false);
  
  // Data State
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Inisiasi data session & missions
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchMissions();
    });
  }, []);

  // Update timer jika user mengubah settings di halaman lain (saat timer pause)
  useEffect(() => {
    if (!isActive) {
        if (mode === 'focus') setTimeLeft(settings.focus * 60);
        if (mode === 'short') setTimeLeft(settings.shortBreak * 60);
        if (mode === 'long') setTimeLeft(settings.longBreak * 60);
    }
  }, [settings, mode, isActive]);

  const fetchMissions = async () => {
    setLoadingMissions(true);
    const { data } = await supabase
      .from("missions")
      .select("*")
      .eq("is_completed", false) 
      .order("created_at", { ascending: true }); // Mengerjakan task terlama dulu
    
    setMissions(data || []);
    if (data && data.length > 0) {
        setSelectedMissionId(data[0].id);
    }
    setLoadingMissions(false);
  };

  // Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Helper pindah mode
  const switchMode = (newMode: TimerMode, autoStart: boolean = false) => {
    setMode(newMode);
    setIsActive(false);

    if (newMode === 'focus') setTimeLeft(settings.focus * 60);
    if (newMode === 'short') setTimeLeft(settings.shortBreak * 60);
    if (newMode === 'long') setTimeLeft(settings.longBreak * 60);

    if (autoStart) {
        setTimeout(() => setIsActive(true), 50);
    }
  };

  const toggleTimer = () => {
    if (!selectedMissionId && mode === 'focus' && missions.length > 0) {
      alert("Please select a mission first to stay focused!");
      return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'focus') setTimeLeft(settings.focus * 60);
    else if (mode === 'short') setTimeLeft(settings.shortBreak * 60);
    else setTimeLeft(settings.longBreak * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Core Logic Flow
  const handleTimerComplete = async () => {
    setIsActive(false);

    if (!session) return;

    // save durasi sesi
    let durationMinutes = settings.focus;
    if (mode === 'short') durationMinutes = settings.shortBreak;
    if (mode === 'long') durationMinutes = settings.longBreak;

    const { error } = await supabase.from('focus_sessions').insert({
      user_id: session.user.id,
      mission_id: mode === 'focus' ? selectedMissionId : null, 
      mode: mode,
      duration_minutes: durationMinutes,
      is_completed: true
    });

    if (error) console.error("Error saving session:", error);

    // pindah mode otomatis
    if (mode === 'focus') {
        if (selectedMissionId) {
            // update misi selesai
            await supabase.from("missions").update({ is_completed: true }).eq("id", selectedMissionId);
            
            // Hapus dari state lokal
            const remainingMissions = missions.filter(m => m.id !== selectedMissionId);
            setMissions(remainingMissions);

            if (remainingMissions.length > 0) {
                alert("Focus session done! Task completed. Take a short break.");
                switchMode('short', true); 
            } else {
                alert("All tasks completed! Enjoy a long break.");
                setSelectedMissionId(null);
                switchMode('long', true); 
            }
        } else {
            switchMode('short', true);
        }

    } else if (mode === 'short') {
        if (missions.length > 0) {
            alert("Break over! Back to work.");
            setSelectedMissionId(missions[0].id);
            switchMode('focus', true); 
        } else {
            alert("Break over. No more tasks.");
            setIsActive(false);
        }

    } else if (mode === 'long') {
        alert("Long break finished. You are refreshed!");
        setIsActive(false);
        setMode('focus');
        setTimeLeft(settings.focus * 60);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F1116] text-white font-sans">
      
      <Sidebar mobileOpen={isSidebarOpen} setMobileOpen={setIsSidebarOpen} />
      
      <main className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center min-h-screen relative w-full min-w-0">
        <div className="flex items-center gap-2 bg-[#1A1D26] p-1.5 rounded-full mb-12">

        <div className="absolute top-6 left-6 z-20 flex items-center gap-4 lg:hidden">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-[#1A1D26] rounded-md text-white hover:bg-white/10 transition-colors">
                <Menu size={24} />
            </button>
            <span className="font-bold text-xl tracking-tight">vocuz.</span>
        </div>

          <button 
            onClick={() => switchMode('focus')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'focus' ? 'bg-[#2A2E3B] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>
            Deep Locked In <Brain size={16}/>
          </button>
          <button 
            onClick={() => switchMode('short')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'short' ? 'bg-[#2A2E3B] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>
            Short Break <Coffee size={16}/>
          </button>
          <button 
            onClick={() => switchMode('long')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'long' ? 'bg-[#2A2E3B] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>
            Long Break <Palmtree size={16}/>
          </button>
        </div>

        {/* Display Timer */}
        <div className="text-[120px] md:text-[220px] font-bold leading-none tracking-tighter tabular-nums select-none transition-all duration-300">
          {formatTime(timeLeft)}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-12">
           <button 
            onClick={toggleTimer}
            className="bg-white text-black px-12 py-4 rounded-xl font-bold text-xl hover:bg-gray-200 transition-transform active:scale-95 flex items-center gap-3">
            {isActive ? "Pause" : "Start"} {isActive ? <Pause fill="black"/> : <Play fill="black"/>}
          </button>
          
          <button 
            onClick={resetTimer}
            className="bg-[#1A1D26] text-white p-4 rounded-xl hover:bg-[#2A2E3B] transition-colors">
            <RotateCcw />
          </button>
        </div>

        {/* Misi Selector (Hanya di mode focus) */}
        {mode === 'focus' && (
          <div className="mt-16 w-full max-w-md text-center">
            <p className="text-gray-500 mb-4 text-sm font-medium uppercase tracking-widest">
                {missions.length > 0 ? "Current Mission Goal" : "No Missions Left"}
            </p>
            
            {loadingMissions ? (
              <div className="text-gray-400 animate-pulse">Loading missions...</div>
            ) : missions.length === 0 ? (
              <div className="text-gray-500 bg-[#1A1D26] p-4 rounded-lg">
                All tasks completed! Great job.
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {missions.map((m) => (
                  <div 
                    key={m.id}
                    onClick={() => !isActive && setSelectedMissionId(m.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between
                      ${selectedMissionId === m.id 
                        ? 'border-white bg-white/10 text-white transform scale-[1.02]' 
                        : 'border-white/5 bg-[#1A1D26] text-gray-400 hover:border-white/20'
                      } ${isActive ? 'cursor-not-allowed opacity-80' : ''}`}>
                    <span className="truncate">{m.title}</span>
                    {selectedMissionId === m.id && <CheckCircle2 size={16} className="text-green-400"/>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-8 text-gray-500 text-sm animate-pulse">
             {isActive ? (mode === 'focus' ? "Stay Hard. Don't quit." : "Recharging energy...") : "Ready to lock in?"}
        </div>

      </main>
    </div>
  );
}