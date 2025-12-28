import { createContext, useContext, useState } from 'react';
import type {ReactNode} from 'react';

// Export type agar bisa dipakai di file lain jika perlu
export type TimerSettings = {
  focus: number;
  shortBreak: number;
  longBreak: number;
};

type TimerContextType = {
  settings: TimerSettings;
  updateSettings: (newSettings: TimerSettings) => void;
};

// Default value (25 menit, 5 menit, 15 menit)
const defaultSettings: TimerSettings = { focus: 25, shortBreak: 5, longBreak: 15 };

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  // Ambil dari localStorage saat awal load, atau pakai default
  const [settings, setSettings] = useState<TimerSettings>(() => {
    // Cek apakah kode dijalankan di browser (untuk menghindari error SSR di beberapa framework)
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('timerSettings');
        return saved ? JSON.parse(saved) : defaultSettings;
    }
    return defaultSettings;
  });

  // Fungsi update & simpan ke localStorage
  const updateSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    localStorage.setItem('timerSettings', JSON.stringify(newSettings));
  };

  return (
    <TimerContext.Provider value={{ settings, updateSettings }}>
      {children}
    </TimerContext.Provider>
  );
}

// Hook kustom agar mudah dipanggil
export function useTimerSettings() {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimerSettings must be used within a TimerProvider");
  return context;
}