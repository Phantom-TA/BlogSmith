import { useState } from "react";
import apiClient from "../../service/apiClient";
import {Link, useNavigate} from 'react-router'
import '../styles/auth.css'
import { useAuth } from "../context/authContext";
import logo from '/logo.png'
import google from '/google.png'

const Login =()=> {
    const [ email, setEmail] = useState("");
    const [ password , setPassword] = useState("");
    const [ error , setError ] = useState("");
    const [ loading , setLoading ]= useState(false)
    const navigate = useNavigate();
    const { login } = useAuth();


    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        setError('');
        try {
            console.log("Logging in")
            const data = await apiClient.login({email  , password})
            console.log('Login response:' ,data)

            if(data.success){
                login(data.data.user)
                navigate('/');
            }
            else{
                
                setError(data.data.error || 'Login failed. Please try again')
                
            }
        }
        catch{
            console.error('Login error:',error)
            setError(error.message || 'An error occured during Login')
        }
        finally{
            setLoading(false)
        }
    }   
    return (
        <div className="auth-page">
           
            <div className="auth-details-container">
                <Link to="/" className="logo">
                    <img src={logo} alt="logo"  className="logo-image"/>
                </Link>
            <h1 className="auth-header">Welcome Back!</h1>
              
            <form onSubmit={handleSubmit} className="auth-form">
                
               
                    <label htmlFor="Email">Email </label>
                    <input 
                    type="email" 
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                
                
                    <label htmlFor="password">Password </label>
                    <input 
                    type="password" 
                    name="password"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                
                <div className="forgot">
                <a >Forgot password?</a>
                </div>
                <button className="auth-submit-button"
                type="submit"
                disabled={loading}
                >
                    {loading ? 'Login...' : 'Login'}
                    
                </button>
                <div class="or-divider">
                    <span>OR</span>
                </div>

                <button className="google-auth"><img src={google} alt="google-icon" />Continue with Google</button>
                <div className="register">
                Dont have an account?<Link to="/signup" className="auth-links">Register</Link> 
                </div>
            </form>
          { error && <div>{error}</div> }
        </div>
         <div className="auth-img-container">
            </div>
        </div>
    )
}
export default Login

{/* <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                    onClick={handleGoogleAuth}
                >
                    <img src={googleIcon} className="w-5" />
                    Continue with Google
                </button> */}