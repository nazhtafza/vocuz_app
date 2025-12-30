import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from "@/components/ui/navbar"
import { Pricing } from './pages/Pricing'    
import { LandingPage } from '@/pages/Landing_Page' 
import Login from './pages/Login'
import SettingsPage from './pages/Settings'
import DashboardMission from './pages/Dash_Missions'
import DashboardTimer from './pages/Dash_Timer'
import { TimerProvider } from "@/context/TimerContext"
import { DashboardSecondBrain } from './pages/Dash_SecBrain'

function App() {
  const location = useLocation();
  const hiddenRoutes = [
    "/login", 
    "/settings", 
    "/dashboard_mission", 
    "/dashboard_timer",
    "/dashboard_secondbrain"
  ];

  const hideNavFooter = hiddenRoutes.includes(location.pathname);
  
  return (
    <TimerProvider>
      
      {!hideNavFooter && <Navbar />}
      
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="/login" element={<Login/>} />
        
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/dashboard_mission' element={<DashboardMission/>}/>
        <Route path="/dashboard_timer" element={<DashboardTimer/>}/>
        <Route path='/dashboard_secondbrain' element={<DashboardSecondBrain/>}/>
      </Routes>

    </TimerProvider>
  );
}

export default App