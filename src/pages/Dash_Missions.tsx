import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { 
  LayoutList, Clock, BookOpen, LineChart, User, Settings, 
  Plus, Pencil, Trash2, Save, X, Square, CheckSquare 
} from "lucide-react";

type Mission = {
    id: string,
    title:string,
    is_completed: boolean,
}

export default function DashboardMission(){
    const [session, setSession] = useState<Session | null>(null);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);

    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    const fetchMissions = async () => { 
        setLoading(true);
        const {data, error} = await supabase
            .from("missions")
            .select("*")
            .order("created_at", {ascending: true});

        if(error) console.error("Error fetching:", error);
        else setMissions(data||[]);
        setLoading(false);
    };

    useEffect(()=> {
        supabase.auth.getSession().then(({data: {session}}) =>{
            setSession(session);
            if(session){
                fetchMissions();
            }
        });
    }, []);

    // Create
    const handleAdd = async() => {
        if(!newTitle.trim() || !session) return;
        
        // Optimistic UI (Opsional, tapi fetch ulang lebih aman untuk ID)
        const {data, error} = await supabase
            .from("missions")
            .insert([{title: newTitle, user_id: session.user.id}])
            .select();

        if(error){
            console.error(error);
        }else if(data){
            setMissions([...missions, data[0]]);
            setNewTitle("");
            setIsAdding(false);
        }
    };

    // Update with checkbox toogle
    const handleToggle = async (id: string, currentStatus:boolean)=>{
        // Optimistic Update
        setMissions(missions.map(m => m.id === id? {...m, is_completed: !currentStatus}: m));

        const {error} = await supabase.from("missions").update({is_completed: !currentStatus}).eq("id", id);
        if (error) console.error("Error updating:", error);
    }

    const startEdit = (mission: Mission) => {
        setEditingId(mission.id);
        setEditTitle(mission.title);
    };

    const saveEdit = async ()=> {
        if(!editTitle.trim() || !editingId) return;

        setMissions(missions.map(m => m.id === editingId? {...m, title : editTitle} :m));
        setEditingId(null);

        const {error} = await supabase.from("missions").update({title: editTitle}).eq("id", editingId);
        if(error) console.error("Error Saving Edit:", error);
    };

    // Delete
    const handleDelete = async (id:string) => {
        if(!confirm("Are you sure wanna delete this mission?")) return;
        setMissions(missions.filter(m => m.id !== id));

        const{error} = await supabase.from("missions").delete().eq("id", id);

        if(error) console.error("Error deleting:", error);
    };

    return(
        <div className="flex min-h-screen bg-[#0F1116] text-white font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#050609] border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
        <h1 className="text-2xl font-bold mb-10 tracking-tight">vocuz.</h1>
        
        <div className="space-y-8 flex-1">
          {/*  General */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 px-2">General</h3>
            <nav className="space-y-1">
              <SidebarItem icon={<LayoutList size={20}/>} label="Define Mission" active />
              <SidebarItem icon={<Clock size={20}/>} label="Start Locked In" />
              <SidebarItem icon={<BookOpen size={20}/>} label="Second Brain" />
              <SidebarItem icon={<LineChart size={20}/>} label="Progress" />
            </nav>
          </div>

          {/*Settings */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 px-2">Settings</h3>
            <nav className="space-y-1">
              <SidebarItem icon={<User size={20}/>} label="Profile" />
              <SidebarItem icon={<Settings size={20}/>} label="Settings" />
            </nav>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-2">Mission</h2>
            <p className="text-gray-400 text-lg">Define on your mission and create the goals</p>
          </div>

          {/* Add New Button */}
          <div className="mb-8">
            {!isAdding ? (
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-white text-black px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors"
              >
                Add New <Plus size={18} />
              </button>
            ) : (
              <div className="flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                <input 
                  autoFocus
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What is your new mission?"
                  className="bg-[#1A1D26] border border-gray-700 text-white px-4 py-2 rounded-md w-full max-w-md focus:outline-none focus:border-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd} className="bg-white text-black px-4 py-2 rounded-md font-medium">Save</button>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 px-3 hover:text-white"><X/></button>
              </div>
            )}
          </div>

          {/* Task List Container */}
          <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-8 min-h-100">
            {loading ? (
              <div className="text-gray-500">Loading missions...</div>
            ) : missions.length === 0 ? (
              <div className="text-gray-500 italic">No missions yet. Start by adding one.</div>
            ) : (
              <div className="space-y-4">
                {missions.map((mission) => (
                  <div key={mission.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                    
                    {/* Checkbox & Title */}
                    <div className="flex items-center gap-4 flex-1">
                      <button 
                        onClick={() => handleToggle(mission.id, mission.is_completed)}
                        className={`text-gray-400 hover:text-white transition-colors ${mission.is_completed ? 'text-green-500' : ''}`}
                      >
                         {/* FIX: CheckSquare sudah diimport */}
                         {mission.is_completed ? <CheckSquare size={24} /> : <Square size={24} />}
                      </button>

                      {editingId === mission.id ? (
                         <input 
                          autoFocus
                          type="text" 
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="bg-transparent border-b border-white text-white focus:outline-none w-full"
                          onBlur={saveEdit}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        />
                      ) : (
                        <span className={`text-lg ${mission.is_completed ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                          {mission.title}
                        </span>
                      )}
                    </div>

                    {/* Actions (Edit/Delete) - Only show on hover */}
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === mission.id ? (
                         <button onClick={saveEdit} className="text-green-500 hover:text-green-400"><Save size={18}/></button>
                      ) : (
                         <button onClick={() => startEdit(mission)} className="text-gray-500 hover:text-white"><Pencil size={18}/></button>
                      )}
                      <button onClick={() => handleDelete(mission.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={18}/></button>
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

// FIX 4: Menambahkan Komponen SidebarItem agar tidak error
function SidebarItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-white text-black font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}