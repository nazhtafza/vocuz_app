import { useState } from "react";
import { Sidebar } from "@/components/section/sidebar"; 
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();
  
  const themeClass = theme === 'dark' ? 'dark' : 'light';
  const dataTheme = (theme === 'mint' || theme === 'brown') ? theme : undefined;

  return (
    <div 
      className={cn("flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300", themeClass)}
      data-theme={dataTheme}>
      
      <Sidebar mobileOpen={isSidebarOpen} setMobileOpen={setIsSidebarOpen} />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 w-full min-w-0 overflow-y-auto">
         <div className="lg:hidden mb-6">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-card border border-border rounded-md">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
             </button>
         </div>

         {/* Content Halaman (Settings, Timer, dll) akan muncul di sini */}
         {children}
      </main>

    </div>
  );
}