import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutList, Clock, BookOpen, LineChart, User, Settings, 
  X, ChevronLeft, ChevronRight 
} from "lucide-react";

type SidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const location = useLocation();
  
  // state buat minimize
  const [isCollapsed, setIsCollapsed] = useState(false);

  // helper buat cek menu aktif
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {mobileOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}/>
      )}

      <aside 
          className={`
              fixed lg:sticky top-0 z-50 h-screen bg-[#050609] border-r border-white/5 flex flex-col 
              transition-all duration-300 ease-in-out
              ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              ${isCollapsed ? "lg:w-20" : "lg:w-64"} 
              w-64 p-4`}>
          {/* Header & Toggle */}
          <div className={`flex items-center mb-10 h-10 ${isCollapsed ? "justify-center" : "justify-between"}`}>
              
              {!isCollapsed && (
                  <h1 className="text-2xl font-bold tracking-tight text-white animate-in fade-in duration-300">vocuz.</h1>
              )}
              {isCollapsed && (
                  <span className="font-bold text-xl text-white">v.</span>
              )}

              {/* mobile closed button*/}
              <button 
                  onClick={() => setMobileOpen(false)} 
                  className="lg:hidden text-gray-400 hover:text-white">
                  <X size={24} />
              </button>

              {/* desktop minimize button */}
              <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:flex absolute -right-3 top-5 bg-[#1A1D26] border border-gray-700 rounded-full p-1 text-gray-400 hover:text-white hover:border-white transition-colors z-50">
                  {isCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
              </button>
          </div>
          
          {/* Menu Items */}
          <div className="space-y-8 flex-1 overflow-y-auto overflow-x-hidden">
              <div>
                  {!isCollapsed && <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 px-2 whitespace-nowrap">General</h3>}
                  <nav className="space-y-1">
                      <SidebarItem icon={<LayoutList size={20}/>} label="Define Mission" to="/dashboard_mission" active={isActive('/dashboard_mission')} collapsed={isCollapsed} />
                      <SidebarItem icon={<Clock size={20}/>} label="Start Locked In" to="/dashboard_timer" active={isActive('/dashboard_timer')} collapsed={isCollapsed} />
                      <SidebarItem icon={<BookOpen size={20}/>} label="Second Brain" to="/dashboard_secondbrain" active={isActive('/dashboard_secondbrain')} collapsed={isCollapsed} />
                      <SidebarItem icon={<LineChart size={20}/>} label="Progress" to="/progress" active={isActive('/progress')} collapsed={isCollapsed} />
                  </nav>
              </div>

              <div>
                  {!isCollapsed && <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 px-2 whitespace-nowrap">Settings</h3>}
                  <nav className="space-y-1">
                      <SidebarItem icon={<User size={20}/>} label="Profile" to="/profile" active={isActive('/profile')} collapsed={isCollapsed} />
                      <SidebarItem icon={<Settings size={20}/>} label="Settings" to="/settings" active={isActive('/settings')} collapsed={isCollapsed} />
                  </nav>
              </div>
          </div>
      </aside>
    </>
  );
}

// Komponen Item Kecil (Internal)
function SidebarItem({ icon, label, to, active = false, collapsed = false }: { icon: any, label: string, to: string, active?: boolean, collapsed?: boolean }) {
  return (
    <Link to={to} title={collapsed ? label : ""}>
      <div className={`
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
    </Link>
  );
}