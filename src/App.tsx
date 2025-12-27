import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from "./components/ui/navbar" // Sesuaikan path import
import { Pricing } from './pages/Pricing'
import { LandingPage } from './pages/Landing_Page'
import Login from './pages/Login'
import DashboardMission from './pages/Dash_Missions' // Import dashboard Anda

function App() {
  const location = useLocation();
  
  const hideNavFooter = location.pathname === "/login" || location.pathname === "/dashboard";
  
  return (
    <>
      {!hideNavFooter && <Navbar />}
      
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<DashboardMission/>} />
      </Routes>
    </>
  )
}

export default App