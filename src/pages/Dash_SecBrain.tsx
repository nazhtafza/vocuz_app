import { useEffect, useState } from "react";
import { Fullscreen, Plus, Menu, Save, Loader2, Trash2, ArrowLeft } from "lucide-react"; 
import { supabase } from "@/supabaseClient"; 
import { Sidebar } from "@/components/section/sidebar";
import type { Session } from "@supabase/supabase-js";

type Note = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
};

export function DashboardSecondBrain() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ title: "", description: "" });

  // 1. Cek Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchNotes();
      else setIsLoading(false);
    });
  }, []);

  // 2. Fetch Data
  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("second_brain_notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIC MODAL ---
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ title: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingId(note.id);
    setFormData({ title: note.title, description: note.description || "" });
    setIsModalOpen(true);
  };

  // 3. Logic Simpan
  const handleSaveNote = async () => {
    if (!formData.title.trim()) return alert("Judul wajib diisi.");
    if (!session) return alert("Wajib login.");

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Update
        const { error } = await supabase
            .from("second_brain_notes")
            .update({ title: formData.title, description: formData.description })
            .eq("id", editingId);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
            .from("second_brain_notes")
            .insert({
                user_id: session.user.id,
                title: formData.title,
                description: formData.description,
            });
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchNotes(); 
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Logic Hapus
  const handleDeleteNote = async () => {
    if (!editingId || !session) return;
    if (!confirm("Hapus catatan ini permanen?")) return;

    setIsSubmitting(true);
    try {
        const { error } = await supabase
            .from("second_brain_notes")
            .delete()
            .eq("id", editingId);
        if (error) throw error;

        setIsModalOpen(false);
        fetchNotes();
    } catch (error: any) {
        alert("Gagal menghapus: " + error.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F1116] text-white font-sans">
      <Sidebar mobileOpen={isSidebarOpen} setMobileOpen={setIsSidebarOpen} />

      <main className="flex-1 p-8 md:p-12 min-h-screen relative w-full min-w-0">
        <div className="max-w-4xl mx-auto">
          <div className="absolute top-6 left-6 z-20 flex items-center gap-4 lg:hidden">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#1A1D26] rounded-md text-white hover:bg-white/10">
                  <Menu size={24} />
              </button>
              <span className="font-bold text-xl tracking-tight">vocuz.</span>
          </div>

          <div className="mt-16 lg:mt-0 mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Second Brain</h1>
              <p className="text-gray-400 text-sm md:text-lg">Your brain is designed for processing, not storage.</p>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-400 animate-pulse">
               <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div> Loading...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note.id} onClick={() => openEditModal(note)} className="group relative h-72 rounded-xl border border-white/10 bg-[#0F1116] p-6 transition-all hover:border-white/30 hover:bg-white/2 flex flex-col cursor-pointer active:scale-[0.98]">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-100 line-clamp-2 pr-2">{note.title}</h3>
                    <button className="text-gray-500 hover:text-white"><Fullscreen size={18} /></button>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed overflow-hidden text-ellipsis line-clamp-6 whitespace-pre-wrap">{note.description || "No description."}</p>
                  <div className="mt-auto pt-4 text-xs text-gray-600 font-mono border-t border-white/5 flex justify-between">
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500">Open</span>
                  </div>
                </div>
              ))}
              <button onClick={openCreateModal} className="h-72 w-full rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all group">
                <Plus size={48} strokeWidth={1.5} className="mb-2 opacity-50 group-hover:opacity-100" />
                <span className="text-sm font-medium">Create New Note</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal*/}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#0F1116] flex flex-col animate-in slide-in-from-bottom-5 duration-300">
            
            <div className="border-b border-white/10 bg-[#0F1116] p-4 md:px-8 md:py-6 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsModalOpen(false)}className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={24}/>
                    </button>
                    <h2 className="text-xl font-bold text-white hidden md:block">
                        {editingId ? "Edit Note" : "New Note"}
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* delete button */}
                    {editingId && (
                        <button onClick={handleDeleteNote} className="text-red-500 hover:bg-red-500/10 p-2.5 rounded-xl transition-colors" title="Delete">
                            <Trash2 size={20}/>
                        </button>
                    )}
                   
                    <button onClick={handleSaveNote}disabled={isSubmitting || !formData.title.trim()}className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                        <span className="hidden md:inline">Save Note</span>
                        <span className="md:hidden">Save</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full p-4 md:p-8">
                {/* Input Judul */}
                <input 
                    type="text" 
                    placeholder="Write your thoughts"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-transparent text-2xl md:text-4xl font-bold text-white placeholder:text-gray-600 focus:outline-none mb-6"
                    autoFocus/>
                
                <textarea 
                    placeholder="Start typing your thoughts here..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="flex-1 w-full bg-transparent text-lg text-gray-300 placeholder:text-gray-600 focus:outline-none resize-none custom-scrollbar leading-relaxed"
                />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}