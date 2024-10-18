import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import LeaveRequestPage from './LeaveRequestPage';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem('userId'));
  const [date, setDate] = useState(new Date()); // State for selected date

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow">
        <Topbar />
        <div className="p-4">
          {/* User Info Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome, {userData?.name}</h2>
            <p className="text-gray-600 mt-2">Email: <span className="font-medium">{userData?.email}</span></p>
            <p className="text-gray-600">Role: <span className="font-medium">{userData?.role}</span></p>
          </div>

          {/* Calendar Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Calendar</h3>
            <Calendar
              onChange={setDate}
              value={date}
              className="border border-gray-300 rounded"
            />
          </div>

          <Routes>
            <Route path="/home" element={<div className="text-gray-700">Welcome to Home</div>} />
            <Route path="/request-leave" element={<LeaveRequestPage />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
