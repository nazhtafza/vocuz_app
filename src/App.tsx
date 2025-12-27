import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { 
  LayoutList, Clock, BookOpen, LineChart, User, Settings, 
  Plus, Pencil, Trash2, Save, X, Square, CheckSquare, Menu,
  ChevronLeft, ChevronRight // Import icon panah baru
} from "lucide-react";

type Mission = {
    id: string,
    title: string,
    is_completed: boolean,
}

export default function DashboardMission(){
    const [session, setSession] = useState<Session | null>(null);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);

    // State UI
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Menu
    const [isCollapsed, setIsCollapsed] = useState(false);     // Desktop Minimize

    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    // Fetch Data
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
        const {data, error} = await supabase
            .from("missions")
            .insert([{title: newTitle, user_id: session.user.id}])
            .select();

        if(error) console.error(error);
        else if(data){
            setMissions([...missions, data[0]]);
            setNewTitle("");
            setIsAdding(false);
        }
    };

    // Update Toggle
    const handleToggle = async (id: string, currentStatus:boolean)=>{
        setMissions(missions.map(m => m.id === id? {...m, is_completed: !currentStatus}: m));
        const {error} = await supabase.from("missions").update({is_completed: !currentStatus}).eq("id", id);
        if (error) console.error("Error updating:", error);
    }

    // Edit Logic
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
        <div className="flex min-h-screen bg-[#0F1116] text-white font-sans relative">
            
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}/>
            )}

            {/* SIDEBAR (Responsive & Collapsible) */}
            <aside 
                className={`
                    fixed lg:sticky top-0 z-50 h-screen bg-[#050609] border-r border-white/5 flex flex-col 
                    transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    ${isCollapsed ? "lg:w-20" : "lg:w-64"} 
                    w-64 p-4
                `} >
                {/* Header Sidebar & Toggle Button */}
                <div className={`flex items-center mb-10 h-10 ${isCollapsed ? "justify-center" : "justify-between"}`}>
                    
                    {/* Logo: Sembunyikan text saat collapsed */}
                    {!isCollapsed && (
                        <h1 className="text-2xl font-bold tracking-tight animate-in fade-in duration-300">vocuz.</h1>
                    )}
                    {isCollapsed && (
                        <span className="font-bold text-xl">v.</span>
                    )}

                    {/* Tombol Close (Mobile Only) */}
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>

                    {/* Tombol Minimize (Desktop Only) */}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-9 bg-[#1A1D26] border border-gray-700 rounded-full p-1 text-gray-400 hover:text-white hover:border-white transition-colors">
                        {isCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
                    </button>
                </div>
                
                {/* Menu Items */}
                <div className="space-y-8 flex-1 overflow-y-auto overflow-x-hidden">
                    <div>
                        {!isCollapsed && <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 px-2 whitespace-nowrap">General</h3>}
                        <nav className="space-y-1">
                            <SidebarItem icon={<LayoutList size={20}/>} label="Define Mission" active collapsed={isCollapsed} />
                            <SidebarItem icon={<Clock size={20}/>} label="Start Locked In" collapsed={isCollapsed} />
                            <SidebarItem icon={<BookOpen size={20}/>} label="Second Brain" collapsed={isCollapsed} />
                            <SidebarItem icon={<LineChart size={20}/>} label="Progress" collapsed={isCollapsed} />
                        </nav>
                    </div>

                    <div>
                         {!isCollapsed && <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 px-2 whitespace-nowrap">Settings</h3>}
                        <nav className="space-y-1">
                            <SidebarItem icon={<User size={20}/>} label="Profile" collapsed={isCollapsed} />
                            <SidebarItem icon={<Settings size={20}/>} label="Settings" collapsed={isCollapsed} />
                        </nav>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full min-w-0">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header Mobile Toggle */}
                    <div className="flex items-center gap-4 mb-6 lg:hidden">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 bg-[#1A1D26] rounded-md text-white hover:bg-white/10">
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-xl">vocuz.</span>
                    </div>
                    
                    <div className="mb-6 lg:mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">Mission</h2>
                        <p className="text-gray-400 text-sm md:text-lg">Define on your mission and create the goals</p>
                    </div>

                    {/* Add New Section */}
                    <div className="mb-8">
                        {!isAdding ? (
                            <button 
                                onClick={() => setIsAdding(true)}
                                className="bg-white text-black px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors w-full md:w-auto justify-center md:justify-start">Add New <Plus size={18} />
                            </button>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-2 animate-in fade-in zoom-in-95 duration-200">
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="New mission..."
                                    className="bg-[#1A1D26] border border-gray-700 text-white px-4 py-2 rounded-md w-full focus:outline-none focus:border-white"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}/>
                                <div className="flex gap-2">
                                    <button onClick={handleAdd} className="bg-white text-black px-4 py-2 rounded-md font-medium flex-1 md:flex-none">Save</button>
                                    <button onClick={() => setIsAdding(false)} className="text-gray-400 px-3 hover:text-white bg-[#1A1D26] md:bg-transparent rounded-md"><X/></button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* List Missions */}
                    <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-4 md:p-8 min-h-100">
                        {loading ? (
                            <div className="text-gray-500 text-center mt-10">Loading...</div>
                        ) : missions.length === 0 ? (
                            <div className="text-gray-500 italic text-center mt-10">No missions yet.</div>
                        ) : (
                            <div className="space-y-3">
                                {missions.map((mission) => (
                                    <div key={mission.id} className="group flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/5 md:border-transparent bg-[#14161F] md:bg-transparent mb-2 md:mb-0">
                                        <div className="flex items-start gap-3 flex-1 mb-3 md:mb-0 overflow-hidden">
                                            <button 
                                                onClick={() => handleToggle(mission.id, mission.is_completed)}
                                                className={`mt-1 md:mt-0 shrink-0 text-gray-400 hover:text-white transition-colors ${mission.is_completed ? 'text-green-500' : ''}`}>
                                                {mission.is_completed ? <CheckSquare size={24} /> : <Square size={24} />}
                                            </button>
                                            <div className="min-w-0 flex-1">
                                                {editingId === mission.id ? (
                                                    <input 
                                                        autoFocus
                                                        type="text" 
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        className="bg-transparent border-b border-white text-white focus:outline-none w-full"
                                                        onBlur={saveEdit}
                                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}/>
                                                ) : (
                                                    <p className={`text-base md:text-lg wrap-break-word ${mission.is_completed ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                                                        {mission.title}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-4 md:gap-3 justify-end md:opacity-0 md:group-hover:opacity-100 transition-opacity border-t border-white/10 pt-2 md:pt-0 md:border-t-0">
                                            {editingId === mission.id ? (
                                                <button onClick={saveEdit} className="text-green-500 hover:text-green-400 flex items-center gap-1 text-sm"><Save size={16}/> Save</button>
                                            ) : (
                                                <button onClick={() => startEdit(mission)} className="text-gray-500 hover:text-white flex items-center gap-1 text-sm"><Pencil size={16}/> <span className="md:hidden">Edit</span></button>
                                            )}
                                            <button onClick={() => handleDelete(mission.id)} className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm"><Trash2 size={16}/> <span className="md:hidden">Delete</span></button>
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

function SidebarItem({ icon, label, active = false, collapsed = false }: { icon: any, label: string, active?: boolean, collapsed?: boolean }) {
  return (
    <div 
        title={collapsed ? label : ""} 
        className={`
            flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors whitespace-nowrap
            ${active ? 'bg-white text-black font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            ${collapsed ? 'justify-center px-2' : ''} `}>
        <div className="shrink-0">
            {icon}
        </div>
    
        {!collapsed && (
            <span className="animate-in fade-in duration-200">{label}</span>
        )}
    </div>
  );
}