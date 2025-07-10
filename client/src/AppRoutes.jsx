
import './App.css'
import Login from './pages/login'
import { Routes , Route, useLocation } from "react-router"
import Home from './pages/Home'
import Signup from './pages/Signup'
import Blog from './pages/Blog'
import Editor from './pages/editor'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

function AppRoutes() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
       {!shouldHideNavbar && <Navbar />}
      <Routes>
         <Route path='/' element={<Home />} />
         <Route path='/login' element={<Login />} /> 
         <Route path='/signup' element={<Signup />} /> 
         <Route path='/blog/:blogId' element={<Blog />} />
         <Route path="/create" element={<Editor />} />
         <Route path="/blog/:blogId/edit" element={<Editor />} />
         <Route path="/profile" element={<Profile />} />
      </Routes>
      </>
    
    
  )
}

export default AppRoutes
