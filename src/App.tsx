import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from "./components/ui/navbar"
import { Pricing } from './pages/Pricing'
function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/pricing" element={<Pricing/>}/>
      </Routes>
    </>
  )
}

export default App
