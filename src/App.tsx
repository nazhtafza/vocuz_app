import { Routes, Route } from 'react-router-dom'
import { Navbar } from "./components/ui/navbar"
import { Pricing } from './pages/Pricing'
import { LandingPage } from './pages/Landing_Page'
function App() {

  return (
    <>
      <Navbar/>
      <Routes>
      <Route path="/" element={<LandingPage/>} />
        <Route path="/pricing" element={<Pricing/>}/>
      </Routes>
    </>
  )
}

export default App
