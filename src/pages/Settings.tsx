import { useState } from "react";
import { Sidebar } from "@/components/section/sidebar"; 
import { useTimerSettings } from "@/context/TimerContext";
import { Save, Menu } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useTimerSettings();
  
  // State untuk Sidebar Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State form lokal
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState("");

  const handleSave = () => {
    updateSettings(form);
    setMessage("Settings saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#0F1116] text-white font-sans relative">
      
      {/* Sidebar dengan props kontrol mobile */}
      <Sidebar mobileOpen={isSidebarOpen} setMobileOpen={setIsSidebarOpen} />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 w-full min-w-0">
        <div className="max-w-2xl mx-auto">
          
          {/* Header Mobile dengan Hamburger Menu */}
          <div className="flex items-center gap-4 mb-6 lg:hidden">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 bg-[#1A1D26] rounded-md text-white hover:bg-white/10">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-xl">Settings</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8 hidden lg:block">Settings</h2>

          <div className="bg-[#1A1D26] border border-white/5 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">Timer Configuration (Minutes)</h3>
            
            <div className="space-y-6">
              
              {/* Focus Input */}
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Deep Focus Duration</label>
                <input 
                  type="number" 
                  value={form.focus}
                  onChange={(e) => setForm({...form, focus: Number(e.target.value)})}
                  className="w-full bg-[#0F1116] border border-gray-700 rounded-lg p-3 text-white focus:border-white focus:outline-none"/>
              </div>

              {/* Short Break Input */}
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Short Break Duration</label>
                <input 
                  type="number" 
                  value={form.shortBreak}
                  onChange={(e) => setForm({...form, shortBreak: Number(e.target.value)})}
                  className="w-full bg-[#0F1116] border border-gray-700 rounded-lg p-3 text-white focus:border-white focus:outline-none"/>
              </div>

              {/* Long Break Input */}
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Long Break Duration</label>
                <input 
                  type="number" 
                  value={form.longBreak}
                  onChange={(e) => setForm({...form, longBreak: Number(e.target.value)})}
                  className="w-full bg-[#0F1116] border border-gray-700 rounded-lg p-3 text-white focus:border-white focus:outline-none"/>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                <button 
                    onClick={handleSave}
                    className="w-full md:w-auto bg-white text-black px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                    <Save size={18} /> Save Changes
                </button>
                {message && <span className="text-green-400 text-sm animate-pulse">{message}</span>}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}