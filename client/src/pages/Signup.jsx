import {useNavigate} from 'react-router'
import apiClient from '../../service/apiClient';
import { useState } from 'react';
import '../styles/auth.css'
import { Link } from "react-router";    

const Signup=()=>{

    const [ name , setName ] = useState("");
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
            console.log("Registering")
            const data = await apiClient.signup({name , email  , password})
            console.log('Signup response:' ,data)

            if(data.success){
                
                navigate('/login');

            }
            else{
               
                setError(data.data.message || 'Signup failed. Please try again')
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
            <h1 className="auth-header">Create account</h1>
               
            <form onSubmit={handleSubmit} className="auth-form">
              
                    <label htmlFor="name">Name </label>
                    <input 
                    type="text" 
                    name="name"
                    id="name"
                    value={name}
                    placeholder="Enter name"
                    onChange={(e) => setName(e.target.value)}
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
                  <div className="register">
                Already have an account? <Link to="/login" className='auth-link'>Login</Link>
                </div>

            </form>
          { error && <div>{error}</div> }
        </div>
        <div className="auth-img-container"></div>
        </div>
    )
}
export default Signup 