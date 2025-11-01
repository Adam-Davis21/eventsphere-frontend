import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(''); // Clear previous messages
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); // Redirect to login page
      }, 1500);
    } catch (error) {
      // Display the error message returned from the backend (or default)
      setMessage(error.message || 'Registration failed.'); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <div className="bg-teal-800 text-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
        
        <form onSubmit={handleSubmit}>
          {['name', 'email', 'password'].map((field) => (
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
            Sign Up
          </button>
        </form>
        
        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('successful') ? 'text-green-300' : 'text-red-300'}`}>
            {message}
          </p>
        )}
        
        <p className="text-center text-sm text-teal-200 mt-6">
          Already registered? <Link to="/login" className="font-medium text-white hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;