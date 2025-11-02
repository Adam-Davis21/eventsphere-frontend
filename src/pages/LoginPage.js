import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // --- THIS IS THE FIX ---
      // We will now store the token that authService.login returns
      const token = await authService.login(formData); 

      // Now, we check if a token was *actually* returned.
      if (token) {
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/'); // Redirect to the dashboard
        }, 500);
      } else {
        // This handles the case where the login didn't fail, but didn't return a token
        setMessage('Login failed. No token received.');
      }
    } catch (error) {
      // This catches backend errors (like "Invalid credentials")
      setMessage(error.message || 'Login failed. Check email and password.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <div className="bg-teal-800 text-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
        <p className="text-center text-teal-200 mb-8">Access your event dashboard</p>
        
        <form onSubmit={handleSubmit}>
          {['email', 'password'].map((field) => (
            <div className="mb-4" key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-teal-100 mb-1 capitalize">{field}</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-teal-700 border-teal-600 text-white rounded-lg focus:ring-teal-400"
                required
              />
            </div>
          ))}
          
          <button type="submit" className="w-full bg-teal-500 font-semibold py-2.5 rounded-lg hover:bg-teal-600 transition mt-4">
            Login
          </button>
        </form>
        
        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('successful') ? 'text-green-300' : 'text-red-300'}`}>
            {message}
          </p>
        )}
        
        <p className="text-center text-sm text-teal-200 mt-6">
          Don't have an account? <Link to="/register" className="font-medium text-white hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;