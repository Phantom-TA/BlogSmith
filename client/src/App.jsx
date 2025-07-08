import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/login'
import { BrowserRouter as Router , Routes , Route } from "react-router"
import Home from './pages/Home'
import Signup from './pages/Signup'

function App() {


  return (
    <Router>
      <Routes>
         <Route path='/' element={<Home />} />
         <Route path='/login' element={<Login />} /> 
         <Route path='/signup' element={<Signup />} /> 
         
      </Routes>
     </Router>
    
  )
}

export default App
