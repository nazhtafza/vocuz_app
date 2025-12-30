import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { Sidebar } from "@/components/section/sidebar"; 
import { 
  Plus, Pencil, Trash2, Save, X, Square, CheckSquare, Menu 
} from "lucide-react";

type Mission = {
  id: string;
  title: string;
  is_completed: boolean;
};

export default function DashboardMission() {
  const [session, setSession] = useState<Session | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // fetch mission data
  const fetchMissions = async () => { 
    setLoading(true);
    const { data, error } = await supabase
      .from("missions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching:", error);
    else setMissions(data || []);
    setLoading(false);
  };

  // session load check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchMissions();
      }
    });
  }, []);

  // logic add mission
  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    if (!session) return alert("Please Login First");

    try {
      // save ke table mission
      const { data: missionData, error: missionError } = await supabase
        .from("missions")
        .insert({
          title: newTitle,
          user_id: session.user.id,
          is_completed: false,
        })
        .select()
        .single();

      if (missionError) throw missionError;

      // B. Auto-generate ke tabel Second Brain Notes
      const { error: noteError } = await supabase
        .from("second_brain_notes")
        .insert({
            user_id: session.user.id,
            title: newTitle,
            description: `Mission Plan: ${newTitle}\n\nTarget:\n- [ ] ...\n- [ ] ...\n\nNotes:`,
        });

      if (noteError) {
        console.warn("Gagal membuat auto-note:", noteError);
      } else {
        console.log("Auto-note created successfully");
      }

      if (missionData) {
        setMissions([missionData, ...missions]);
        setNewTitle("");
        setIsAdding(false);
      }

    } catch (error: any) {
      alert("Error adding mission: " + error.message);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setMissions(missions.map(m => m.id === id ? { ...m, is_completed: !currentStatus } : m));
    
    // Update ke Database
    await supabase.from("missions").update({ is_completed: !currentStatus }).eq("id", id);
  };

  // logic edit
  const startEdit = (mission: Mission) => {
    setEditingId(mission.id);
    setEditTitle(mission.title);
  };

  const saveEdit = async () => {
    if (!editTitle.trim() || !editingId) return;

    setMissions(missions.map(m => m.id === editingId ? { ...m, title: editTitle } : m));
    const idToUpdate = editingId; // Simpan ID sebelum di-null-kan
    setEditingId(null);

    await supabase.from("missions").update({ title: editTitle }).eq("id", idToUpdate);
  };

  // 6. Logic Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure wanna delete this mission?")) return;

    setMissions(missions.filter(m => m.id !== id));
    await supabase.from("missions").delete().eq("id", id);
  };

  return (
    <div className="flex min-h-screen bg-[#0F1116] text-white font-sans relative">
      
      {/* Sidebar Component */}
      <Sidebar mobileOpen={isSidebarOpen} setMobileOpen={setIsSidebarOpen} />

      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full min-w-0">
        <div className="max-w-4xl mx-auto">
        
          {/* Header Mobile: Tombol Hamburger */}
          <div className="flex items-center gap-4 mb-6 lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-[#1A1D26] rounded-md text-white hover:bg-white/10">
              <Menu size={24} />
            </button>
            <span className="font-bold text-xl">vocuz.</span>
          </div>

          {/* Page Header */}
          <div className="mb-6 lg:mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Mission</h2>
            <p className="text-gray-400 text-sm md:text-lg">Define on your mission and create the goals</p>
          </div>

          {/* Add New Mission Section */}
          <div className="mb-8">
            {!isAdding ? (
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-white text-black px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors w-full md:w-auto justify-center md:justify-start">
                Add New <Plus size={18} />
              </button>
            ) : (
              <div className="flex flex-col md:flex-row gap-2 animate-in fade-in zoom-in-95 duration-200">
                <input autoFocus type="text" value={newTitle}onChange={(e) => setNewTitle(e.target.value)} placeholder="What is your new mission?"
                  className="bg-[#1A1D26] border border-gray-700 text-white px-4 py-2 rounded-md w-full focus:outline-none focus:border-white transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}/>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAdd} 
                    className="bg-white text-black px-4 py-2 rounded-md font-medium flex-1 md:flex-none hover:bg-gray-200">
                    Save
                  </button>
                  <button 
                    onClick={() => { setIsAdding(false); setNewTitle(""); }} 
                    className="text-gray-400 px-3 hover:text-white bg-[#1A1D26] md:bg-transparent rounded-md border border-gray-700 md:border-transparent">
                    <X />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mission List Container */}
          <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-4 md:p-8 min-h-75">
            {loading ? (
              <div className="text-gray-500 text-center mt-10 animate-pulse">Loading missions...</div>
            ) : missions.length === 0 ? (
              <div className="text-gray-500 italic text-center mt-10">No missions yet. Start by adding one.</div>
            ) : (
              <div className="space-y-3">
                {missions.map((mission) => (
                  <div key={mission.id} className="group flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/5 md:border-transparent bg-[#14161F] md:bg-transparent mb-2 md:mb-0">
                    {/* Checkbox*/}
                    <div className="flex items-start gap-3 flex-1 mb-3 md:mb-0 overflow-hidden">
                      <button 
                        onClick={() => handleToggle(mission.id, mission.is_completed)}
                        className={`mt-1 md:mt-0 shrink-0 hover:text-white transition-colors ${mission.is_completed ? 'text-green-500' : 'text-gray-400'}`}>
                        {mission.is_completed ? <CheckSquare size={24} /> : <Square size={24} />}
                      </button>

                      <div className="min-w-0 flex-1 pt-0.5">
                        {editingId === mission.id ? (
                          <input 
                            autoFocus
                            type="text" 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="bg-transparent border-b border-white text-white focus:outline-none w-full pb-1"
                            onBlur={saveEdit}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}/>
                        ) : (
                          <p 
                            onDoubleClick={() => startEdit(mission)}
                            className={`text-base md:text-lg wrap-break-word cursor-pointer ${mission.is_completed ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                            {mission.title}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Edit and delete button*/}
                    <div className="flex gap-4 md:gap-3 justify-end md:opacity-0 md:group-hover:opacity-100 transition-opacity border-t border-white/10 pt-2 md:pt-0 md:border-t-0">
                      {editingId === mission.id ? (
                        <button onClick={saveEdit} className="text-green-500 hover:text-green-400 flex items-center gap-1 text-sm">
                          <Save size={16}/> Save
                        </button>
                      ) : (
                        <button onClick={() => startEdit(mission)} className="text-gray-500 hover:text-white flex items-center gap-1 text-sm">
                          <Pencil size={16}/> <span className="md:hidden">Edit</span>
                        </button>
                      )}
                      <button onClick={() => handleDelete(mission.id)} className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm">
                        <Trash2 size={16}/> <span className="md:hidden">Delete</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}