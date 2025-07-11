import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useAuth } from "../context/authContext";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import '../styles/Navbar.css'
import Search from '/search.png'
import Write from '/write.png'
import logo from '/logo.png'

const Navbar =() =>{
    const {user,logout} = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen,setDropdownOpen] = useState(false);
    const dropdownRef = useRef();


    const handleWrite= () =>{
        if(!user)
            navigate("/login")
        else
            navigate("/create")
    }

    const handleLogout = () =>{
        logout();
        navigate("/login")
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="navbar">
           
            <div className="navbar-left">
                <Link to="/" className="logo">
                <img src={logo} alt="logo"  className="logo-image"/>
                <span className="logo-header">BlogSmith</span>
                </Link>
                <div className="search-bar">
                <img src={Search} alt="search-icon" className="search-icon"/>
                <input type="text" placeholder="Search" className="search-input"/>
                </div>

            </div>
            <div className="navbar-right">
                <button className="write-btn" onClick={handleWrite}> <img src={Write} />  Write</button>
                {!user ? (
                    <>
                    <Link to="/login" className="auth-link"> <button className="auth-btn">Login</button></Link>
                    <Link to="/signup" className="auth-link"><button className="auth-btn">Signup</button></Link>
                    </>
                ):(
                <div className="profile-section" ref={dropdownRef}>
                    <img src={user.profile_img || "/auth-pic.webp" } alt="profile-pic" className={dropdownOpen ? "profile-pic-active " : "profile-pic"} onClick={()=>setDropdownOpen(!dropdownOpen)} />
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <Link to="/profile">Profile</Link>
                            <Link to="/change-password">Change Password</Link>
                            <button onClick={handleLogout}>Sign Out</button>
                        </div>
                    )}

                </div>
                )}
            </div>
        </div>
    )
}
export default Navbar;
