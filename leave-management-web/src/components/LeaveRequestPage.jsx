import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Sidebar from './Sidebar'; // Import Sidebar
import Topbar from './Topbar'; // Import Topbar

const LeaveRequestPage = () => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Get Token from local storage
      const year = new Date(startDate).getFullYear() + ""; // Get year from start date
      const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1; // Calculate number of leave days
      const userNote = leaveReason; // Save user note
      const tasksLink = 'http://example.com/tasks'; // Replace with your desired link

      const data = {
        type: leaveType.toUpperCase(), // Convert to uppercase as required by API
        year,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        days,
        userNote,
        tasksLink,
      }

      console.log(data);

      const response = await axios.post('http://localhost:8800/api/leaves', data, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Token in Headers
        },
      });
      alert('Apply Leave sent successfully!');
      navigate('/home'); // Navigate back to Home page
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Error submitting leave request: ' + error.response?.data?.message || 'Unknown error occurred.'); // Show error message
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Add Sidebar */}
      <div className="flex-grow">
        <Topbar /> {/* Add Topbar */}
        <div className="flex flex-col items-center h-full p-6">
          <h1 className="text-2xl font-bold mb-4">Request Leave</h1>
          <form onSubmit={handleSubmit} className="mt-4 space-y-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <div>
              <label className="block mb-1 font-semibold">Leave Type</label>
              <select 
                className="select w-full max-w-xs border-gray-300" 
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="">Select Leave Type</option>
                <option value="SICK_LEAVE">SICK_LEAVE</option>
                <option value="ANNUAL_LEAVE">ANNUAL_LEAVE</option>
                <option value="EMERGENCY_LEAVE">EMERGENCY_LEAVE</option>
                <option value="MATERNITY_LEAVE">MATERNITY_LEAVE</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Start Date</label>
              <input 
                type="date" 
                className="input w-full max-w-xs border-gray-300" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">End Date</label>
              <input 
                type="date" 
                className="input w-full max-w-xs border-gray-300" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Leave Reason</label>
              <textarea 
                className="textarea w-full max-w-xs border-gray-300" 
                rows="4" 
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full">Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestPage;
