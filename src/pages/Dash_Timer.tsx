import { useEffect, useState, useRef } from "react";
import { supabase } from "@/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { 
  Pause, RotateCcw, Coffee, Palmtree, Brain, CheckCircle2, Menu,
  Play, Volume2, VolumeX, Music as MusicIcon
} from "lucide-react";
import { Sidebar } from "@/components/section/sidebar";
import { useTimerSettings } from "@/context/TimerContext";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Types ---
type Mission = {
  id: string;
  title: string;
  is_completed: boolean;
};

// --- Tracks Data ---
const Tracks = [
  {id: "lofi", name: "Lofi Focus", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"},
  {id: "rainy", name: "Heavy Rain", url: "https://cdn.pixabay.com/download/audio/2022/07/04/audio_32448386e8.mp3"},
  {id: "white", name: "White Noise", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3"},
  {id: "forest", name: "Forest Nature", url: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_37dbf60296.mp3"},
];

type TimerMode = 'focus' | 'short' | 'long';

export default function DashboardTimer() {
  const [session, setSession] = useState<Session | null>(null);
  
  // Context Settings
  const { settings } = useTimerSettings();
  
  // State Timer
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60);
  const [isActive, setIsActive] = useState(false);
  
  // State Mission
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   // State Audio
   const audioRef = useRef<HTMLAudioElement | null>(null);
   const [currentTrack, setCurrentTrack] = useState(Tracks[0]);
   const [isPlaying, setIsPlaying] = useState(false);
   const [volume, setVolume] = useState([50]); 
   const [isMuted, setIsMuted] = useState(false);
   const [isPlayerExpanded, setIsPlayerExpanded] = useState(true);

  //  Inisiasi Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchMissions();
    });
  }, []);

  //audio player
  useEffect(() => {
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume[0] / 100;

    // Auto-resume jika sebelumnya sedang playing
    if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio prevent:", e));
    }

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [currentTrack]);

  // Sync Play/Pause
  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying && !isMuted) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, isMuted]);

  // Sync Volume
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
     if (isActive) setIsPlaying(true);
     else setIsPlaying(false);
  }, [isActive]);


  // Update timer dari settings
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
      .order("created_at", { ascending: true });
    
    setMissions(data || []);
    if (data && data.length > 0) {
        setSelectedMissionId(data[0].id);
    }
    setLoadingMissions(false);
  };

  // Timer Interval Logic
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

  // Helper Switch Mode
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
      if(!confirm("You haven't selected a mission. Start anyway?")) return;
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

  const handleTimerComplete = async () => {
    setIsActive(false);
    try {
        // Pastikan file alarm.mp3 ada di folder public
        const audio = new Audio('/alarm.mp3'); 
        audio.play().catch(e => console.log("Audio play error", e));
    } catch (e) {
        console.error(e);
    }

    if (!session) return;

    let durationMinutes = settings.focus;
    if (mode === 'short') durationMinutes = settings.shortBreak;
    if (mode === 'long') durationMinutes = settings.longBreak;

    const { error } = await supabase.from('focus_sessions').insert({
      user_id: session.user.id,
      mission_id: (mode === 'focus' && selectedMissionId) ? selectedMissionId : null, 
      mode: mode,
      duration_minutes: durationMinutes,
      is_completed: true
    });

    if (error) console.error("Error saving session:", error);

    if (mode === 'focus') {
        if (selectedMissionId) {
            await supabase.from("missions").update({ is_completed: true }).eq("id", selectedMissionId);
            
            const remainingMissions = missions.filter(m => m.id !== selectedMissionId);
            setMissions(remainingMissions);

            if (remainingMissions.length > 0) {
                alert("Focus session done! Taking a short break.");
                switchMode('short', true); 
            } else {
                alert("All tasks completed! Taking a long break.");
                setSelectedMissionId(null);
                switchMode('long', true); 
            }
        } else {
            switchMode('short', true);
        }

    } else if (mode === 'short') {
        if (missions.length > 0) {
            alert("Break over! Back to work.");
            if(!selectedMissionId) setSelectedMissionId(missions[0].id);
            switchMode('focus', true); 
        } else {
            setIsActive(false);
        }

    } else if (mode === 'long') {
        alert("Long break finished.");
        setIsActive(false);
        setMode('focus');
        setTimeLeft(settings.focus * 60);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F1116] text-white font-sans">
      
      <Sidebar mobileOpen={isSidebarOpen} setMobileOpen={setIsSidebarOpen} />
      
      <main className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center min-h-screen relative w-full min-w-0">
        
        {/* HEADER MOBILE */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-4 lg:hidden">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-[#1A1D26] rounded-md text-white hover:bg-white/10 transition-colors">
                <Menu size={24} />
            </button>
            <span className="font-bold text-xl tracking-tight">vocuz.</span>
        </div>

        {/* MODE SWITCHER */}
        <div className="flex items-center gap-2 bg-[#1A1D26] p-1.5 rounded-full mb-12 relative z-10">
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

        {/* TIMER DISPLAY */}
        <div className="text-[120px] md:text-[220px] font-bold leading-none tracking-tighter tabular-nums select-none transition-all duration-300">
          {formatTime(timeLeft)}
        </div>

        {/* CONTROLS */}
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

        {/* MISSION SELECTOR (FOCUS ONLY) */}
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

        {/* --- FLOATING MUSIC PLAYER --- */}
        <div className={cn(
            "fixed bottom-6 right-6 z-50 bg-[#1A1D26] border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden",
            isPlayerExpanded ? "w-80 p-4" : "w-14 h-14 p-0 rounded-full cursor-pointer hover:scale-110")}>
            {isPlayerExpanded ? (
                // EXPANDED VIEW
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
                            <MusicIcon size={16} className="text-blue-500" />
                            <span>Focus Audio</span>
                        </div>
                        <button onClick={() => setIsPlayerExpanded(false)} className="text-gray-500 hover:text-white">
                             <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                         {/* Track Selector */}
                         <Select 
                            value={currentTrack.id} 
                            onValueChange={(val) => {
                                const t = Tracks.find(x => x.id === val);
                                if(t) setCurrentTrack(t);
                                setIsPlaying(true);
                            }}>
                            <SelectTrigger className="w-full h-8 bg-[#0F1116] border-white/10 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A1D26] border-white/10 text-white">
                                {Tracks.map(t => (
                                    <SelectItem key={t.id} value={t.id} className="focus:bg-white/10 focus:text-white">{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-3">
                            {/* Play/Pause Button */}
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                    isPlaying ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                                )}>
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1"/>}
                            </button>
                            
                            {/* Volume Control */}
                            <div className="flex-1 flex items-center gap-2">
                                <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white">
                                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                                <Slider 
                                    value={volume} max={100} onValueChange={setVolume} className="flex-1" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // MINIMIZED VIEW
                <div 
                    onClick={() => setIsPlayerExpanded(true)}
                    className="w-full h-full flex items-center justify-center bg-blue-600 text-white">
                    {isPlaying ? (
                        <div className="flex gap-1 items-end h-4">
                             <span className="w-1 bg-white animate-bounce h-2"></span>
                             <span className="w-1 bg-white animate-[bounce_1.2s_infinite] h-4"></span>
                             <span className="w-1 bg-white animate-[bounce_0.8s_infinite] h-3"></span>
                        </div>
                    ) : (
                        <MusicIcon size={20} />
                    )}
                </div>
            )}
        </div>

      </main>
    </div>
  );
}