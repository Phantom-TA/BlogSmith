import {useNavigate} from 'react-router'
import apiClient from '../../service/apiClient';
import { useState } from 'react';
import '../styles/auth.css'
import { Link } from "react-router";    
import { useAuth } from '../context/authContext';
import logo from '/logo.png'
import google from '/google.png'

const Signup=()=>{

    const [ fullname , setFullname ] = useState("");
    const [ email, setEmail] = useState("");
    const [ password , setPassword] = useState("");
    const [ error , setError ] = useState("");
    const [ loading , setLoading ]= useState(false)
     const { login } = useAuth()
    const navigate = useNavigate();
    
   
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        setError('');

        try {
            console.log("Registering")
            
            const data = await apiClient.register({fullname , email  , password})
            console.log('Signup response:' ,data)

            if(data.success){
                login(data.data.user)
                navigate('/');

            }
            else{
               
                setError(data.data.error || 'Signup failed. Please try again')
            }
        } catch (error) {
            console.error('Signup error:',error)
            setError(error.message || 'An error occured during signup')
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
            <h1 className="auth-header">Create account</h1>
               
            <form onSubmit={handleSubmit} className="auth-form">
              
                    <label htmlFor="name">Name </label>
                    <input 
                    type="text" 
                    name="name"
                    id="name"
                    value={fullname}
                    placeholder="Enter name"
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    />
             
                
                    <label htmlFor="Email">Email </label>
                    <input 
                    type="email" 
                    name="email"
                    id="email"
                    value={email}
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                
               
                    <label htmlFor="password">Password </label>
                    <input 
                    type="password" 
                    name="password"
                    id="password"
                    value={password}
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                
                
                <button
                type="submit"
                disabled={loading}
                className="auth-submit-button"
                >
                    {loading ? 'Signup...' : 'Signup'}
                    
                </button>
                 <div class="or-divider">
                    <span>OR</span>
                </div>
                
                <button className="google-auth"><img src={google} alt="google-icon" />Continue with Google</button>
                                
                <div className="register">
                Already have an account? <Link to="/login" className='auth-links'>Login</Link>
                </div>

            </form>
          { error && <div>{error}</div> }
        </div>
        <div className="auth-img-container"></div>
        </div>
    )
}
export default Signup 