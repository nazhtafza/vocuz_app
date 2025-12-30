import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { Sidebar } from "@/components/section/sidebar";
import { Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Ganti dengan 'next/navigation' jika pakai Next.js

export default function DashboardProfile() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Jika menggunakan React Router (Vite/CRA)
  const navigate = useNavigate();
  // Jika Next.js, gunakan: const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error signing out: " + error.message);
    } else {
      // Redirect ke halaman login
      navigate("/login"); // Sesuaikan route login Anda
      // Jika Next.js: router.push('/login');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Helper untuk mendapatkan Nama (bisa dari metadata atau email)
  const getUserName = () => {
    if (!session?.user) return "Trooper";
    // Cek jika ada nama di metadata (jika Anda menyimpannya saat register)
    const metaName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
    if (metaName) return metaName;
    // Fallback: Ambil nama depan dari email
    return session.user.email?.split('@')[0] || "Unknown Trooper";
  };

  return (
    <div className="flex min-h-screen bg-[#0F1116] text-white font-sans relative">
      
      {/* Sidebar */}
      <Sidebar mobileOpen={isSidebarOpen} setMobileOpen={setIsSidebarOpen} />

      <main className="flex-1 p-6 md:p-12 w-full min-w-0">
        <div className="max-w-4xl mx-auto">
            
            {/* Header Mobile */}
            <div className="flex items-center gap-4 mb-8 lg:hidden">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 bg-[#1A1D26] rounded-md text-white hover:bg-white/10">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-xl">vocuz.</span>
            </div>

            {/* Title Section */}
            <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">Study Trooper</h1>
                <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed">
                    It's not just about what you learn, but who you become. Forging resilience through one focused session at a time.
                </p>
            </div>

            {/* Content Container */}
            <div className="space-y-6">

                {/* Card 1: Trooper Information */}
                <div className="bg-[#151720] border border-white/5 rounded-none md:rounded-lg p-6 md:p-8">
                    <h2 className="text-lg font-bold text-white mb-6">Trooper Information</h2>
                    
                    {loading ? (
                        <div className="animate-pulse flex gap-6">
                            <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
                            <div className="space-y-3 flex-1">
                                <div className="h-6 bg-gray-700 w-1/3 rounded"></div>
                                <div className="h-4 bg-gray-700 w-1/2 rounded"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Avatar Placeholder */}
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 shrink-0">
                                {/* Jika ada URL foto, ganti dengan <img src={...} /> */}
                                <User size={48} className="text-gray-500 opacity-50"/> 
                            </div>

                            {/* User Details */}
                            <div className="flex-1 space-y-1">
                                <h3 className="text-2xl md:text-3xl font-bold text-white">
                                    {getUserName()}
                                </h3>
                                <p className="text-gray-400 text-lg">
                                    {session?.user.email}
                                </p>
                                <p className="text-gray-500 pt-1">
                                    Member since {formatDate(session?.user.created_at)}
                                </p>

                                <div className="pt-4">
                                    <button 
                                        onClick={() => alert("Fitur edit profile belum tersedia di backend.")}
                                        className="bg-[#1A1D26] hover:bg-[#252836] border border-white/10 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Card 2: Trooper Actions */}
                <div className="bg-[#151720] border border-white/5 rounded-none md:rounded-lg p-6 md:p-8">
                    <h2 className="text-lg font-bold text-white mb-2">Trooper Actions</h2>
                    <p className="text-gray-400 mb-6 max-w-xl">
                        Execute command protocols for your account security and session status.
                    </p>
                    
                    <button 
                        onClick={handleSignOut}
                        className="bg-[#1A1D26] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 border border-white/10 text-white px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 group">
                        <LogOut size={16} className="group-hover:text-red-500"/>
                        Sign Out
                    </button>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}