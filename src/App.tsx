import { Routes, Route } from 'react-router-dom'
import { Navbar } from "./components/ui/navbar"
import { Pricing } from './pages/Pricing'
import { LandingPage } from './pages/Landing_Page'
import Login from './pages/Login'

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
      <Route path="/" element={<LandingPage/>} />
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </>
  )
}

export default App
