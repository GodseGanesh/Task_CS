
import { useState } from "react";
import axios from 'axios'
import {useNavigate,Link} from 'react-router-dom'


const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  const navigate = useNavigate()
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/api/register/`, {
        email,
        password,
        password2,
      });

      if (res.status === 201 || res.status === 200) {
        navigate('/login');
      }
    } catch (err) {
        setError("Registration failed, please try again.");
      
    }
    
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow rounded">
        <h3 className="mb-3">Register</h3>
        { error && (<div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
        >
            <button
                type="button"
                classclassName="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
            ></button>
            <strong>{ error }</strong>
        </div>) }
        
        
       
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              className="form-control"
              type="password"
              name="confirmPassword"
              value={password2}
              onChange={(e)=>setPassword2(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>

        <p className="mt-3 text-center">
  Already have an account? <Link to="/login">Login here</Link>
</p>

      </div>
    </div>
  );
};

export default Register;
