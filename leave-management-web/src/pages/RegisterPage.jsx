import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const navigate = useNavigate(); // สร้างตัวแปร navigate
  
    const handleRegister = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://localhost:8800/api/users/register', { name, email, password, confirmPassword });
        alert('Registration successful!');
        navigate('/'); // นำทางไปยังหน้า login
      } catch (error) {
        console.error(error);
        alert('Registration failed!');
      }
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Name" 
            required 
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Confirm Password" 
            required 
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
          <p className="mt-4 text-center">
            Already have an account? 
            <a href="/" className="text-blue-500"> Login</a>
          </p>
        </form>
      </div>
    );
  };
  
  export default RegisterPage;
  