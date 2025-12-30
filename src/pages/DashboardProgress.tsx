import { useState } from "react";
import { Sidebar } from "@/components/section/sidebar"; // Pastikan path import sesuai
import { Menu, BarChart3} from "lucide-react";

export default function DashboardProgress() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0F1116] text-white font-sans">
      
      <Sidebar mobileOpen={isSidebarOpen} setMobileOpen={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 relative w-full min-w-0 min-h-screen">
        
        <div className="absolute top-6 left-6 z-20 flex items-center gap-4 lg:hidden">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-[#1A1D26] rounded-md text-white hover:bg-white/10 transition-colors">
                <Menu size={24} />
            </button>
            <span className="font-bold text-xl tracking-tight">vocuz.</span>
        </div>

        {/* Center Content Container */}
        <div className="flex flex-col items-center text-center max-w-lg animate-in fade-in zoom-in-95 duration-700">
            
            <div className="w-24 h-24 bg-[#1A1D26] rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]">
                <BarChart3 className="text-gray-400" size={40} strokeWidth={1.5} />
            </div>

            <div className="bg-[#1A1D26] px-5 py-2 rounded-full border border-white/10 text-xs font-semibold text-gray-400 tracking-widest uppercase mb-6">
                Under Development
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight bg-linear-to-b from-white to-gray-400 bg-clip-text text-transparent">
                Dashboard Progress
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed">
                We’re still building amazing features to help you track your productivity stats and analytics.
            </p>

        </div>

        <div className="absolute bottom-8 text-gray-600 text-sm font-mono">
            v0.1.0 Beta
        </div>

      </main>
    </div>
  );
}