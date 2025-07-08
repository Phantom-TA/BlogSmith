import { useState } from "react";
import apiClient from "../../service/apiClient";
import {Link, useNavigate} from 'react-router'
import '../styles/auth.css'

const Login =()=> {
    const [ email, setEmail] = useState("");
    const [ password , setPassword] = useState("");
    const [ error , setError ] = useState("");
    const [ loading , setLoading ]= useState(false)
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        setError('');
        try {
            console.log("Logging in")
            const data = await apiClient.login({email  , password})
            console.log('Login response:' ,data)

            if(data.success){

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
                <div className="register">
                Don’t have an account?<Link to="/signup" className="auth-link">Register</Link> 
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