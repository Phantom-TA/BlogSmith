import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/login'
import { BrowserRouter as Router , Routes , Route } from "react-router"
import Home from './pages/Home'
import Signup from './pages/Signup'
import Blog from './pages/Blog'
import Editor from './pages/editor'

function App() {


  return (
    <Router>
      <Routes>
         <Route path='/' element={<Home />} />
         <Route path='/login' element={<Login />} /> 
         <Route path='/signup' element={<Signup />} /> 
         <Route path='/blog/:blogId' element={<Blog />} />
         <Route path="/create" element={<Editor />} />
         <Route path="/edit/:blogId" element={<Editor />} />
      </Routes>
     </Router>
    
  )
}

export default App
