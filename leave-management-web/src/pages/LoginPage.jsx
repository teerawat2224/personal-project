import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import useUserStore from '../stores/userStore';

const LoginPage = () => {
  const login = useUserStore( state => state.login  )
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // สร้างฟังก์ชันนำทาง

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8800/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      await login( { email, password })
      alert('Login successful!');
      navigate('/home'); // นำทางไปที่หน้า Home หลังจากล็อกอินสำเร็จ
    } catch (error) {
      console.error(error);
      alert('Login failed!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-300">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
          className="w-full p-2 border border-yellow-300 rounded mb-4"
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account? 
          <a href="/register" className="text-blue-500"> Register</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
