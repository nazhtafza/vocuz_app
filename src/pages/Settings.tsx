import { useState } from "react";
import DashboardLayout from "@/pages/DashboardLayout"; // Import Layout Baru
import { useTimerSettings } from "@/context/TimerContext";
import { useTheme } from "@/context/ThemeContext"; 
import { cn } from "@/lib/utils"; 
import { Save, Sun, Leaf, Moon, Coffee, Check } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useTimerSettings();
  const { theme, setTheme } = useTheme();
  
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState("");

  const handleSave = () => {
    updateSettings(form);
    setMessage("Settings saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const themes = [
    { id: "light", name: "Light", icon: <Sun className="w-4 h-4" />, colors: { bg: "bg-white", border: "border-slate-200", accent: "bg-blue-600" } },
    { id: "dark", name: "Dark", icon: <Moon className="w-4 h-4" />, colors: { bg: "bg-slate-950", border: "border-slate-800", accent: "bg-blue-500" } },
    { id: "mint", name: "Mint Focus", icon: <Leaf className="w-4 h-4" />, colors: { bg: "bg-[#f0fdf4]", border: "border-emerald-200", accent: "bg-emerald-600" } },
    { id: "brown", name: "Calm Brown", icon: <Coffee className="w-4 h-4" />, colors: { bg: "bg-[#fff8f0]", border: "border-orange-200", accent: "bg-[#785a46]" } }
  ];

  return (
    // BUNGKUS DENGAN DASHBOARD LAYOUT
    <DashboardLayout>
        
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 hidden lg:block">Settings</h2>

          {/* Timer Config Section */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8 shadow-sm transition-colors duration-300">
            <h3 className="text-xl font-bold mb-6">Timer Configuration</h3>
            <div className="space-y-6">
              {/* Inputs... (Sama seperti sebelumnya) */}
              <div>
                <label className="block text-muted-foreground mb-2 text-sm">Deep Focus Duration</label>
                <input type="number" value={form.focus} onChange={(e) => setForm({...form, focus: Number(e.target.value)})} className="w-full bg-background border border-input rounded-lg p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"/>
              </div>
              <div>
                 <label className="block text-muted-foreground mb-2 text-sm">Short Break</label>
                 <input type="number" value={form.shortBreak} onChange={(e) => setForm({...form, shortBreak: Number(e.target.value)})} className="w-full bg-background border border-input rounded-lg p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"/>
              </div>
              <div>
                 <label className="block text-muted-foreground mb-2 text-sm">Long Break</label>
                 <input type="number" value={form.longBreak} onChange={(e) => setForm({...form, longBreak: Number(e.target.value)})} className="w-full bg-background border border-input rounded-lg p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"/>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button onClick={handleSave} className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90">
                    <Save size={18} /> Save
                </button>
                {message && <span className="text-green-500 text-sm">{message}</span>}
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm transition-colors duration-300">
            <div className="mb-6">
                <h3 className="text-xl font-bold">Appearance</h3>
                <p className="text-muted-foreground text-sm mt-1">Select a theme that fits your vibe.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themes.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTheme(t.id as any)}
                        className={cn(
                            "group relative flex flex-col items-center gap-3 p-2 rounded-xl border-2 transition-all duration-200 hover:bg-accent",
                            theme === t.id ? "border-primary bg-accent/50" : "border-transparent hover:border-border"
                        )}
                    >
                        <div className={cn("w-full aspect-video rounded-lg shadow-sm p-2 flex flex-col gap-2 overflow-hidden transition-colors", t.colors.bg)}>
                             <div className={cn("w-3/4 h-2 rounded-full opacity-50", t.id === 'dark' ? 'bg-slate-700' : 'bg-slate-300')} />
                             <div className={cn("mt-auto w-6 h-6 rounded-full", t.colors.accent)} />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground">
                            {t.icon} {t.name}
                        </div>
                        {theme === t.id && (
                            <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-0.5 shadow-lg">
                                <Check size={12} strokeWidth={3} />
                            </div>
                        )}
                    </button>
                ))}
            </div>
          </div>

        </div>

    </DashboardLayout>
  );
}