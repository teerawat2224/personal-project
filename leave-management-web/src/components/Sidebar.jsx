import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <div className="bg-pink-100 h-screen w-60 flex flex-col items-center py-6">
      <div className="mb-10">
        <div className="bg-green-300 rounded-full h-16 w-16 flex items-center justify-center cursor-pointer" onClick={handleToggle}>
          <i className="fas fa-user text-2xl text-white"></i>
        </div>
        <div className="text-center mt-2">
          <p className="text-gray-700">Title</p>
          <p className="text-gray-400">Description</p>

          {isOpen && (
            <ul className="absolute bg-base-100 rounded-box z-[1] w-52 p-2 shadow mt-2">
              <li>
                <a onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-200">Logout</a>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-6 text-left w-full px-4">
        <button className="btn btn-outline btn-info w-full" onClick={() => navigate('/home')}>
          HOME
        </button>
        <button className="btn btn-outline btn-success w-full" onClick={() => navigate('/request-leave')}>
          Manage Leaves
        </button>
        <button className="btn btn-outline btn-warning w-full" onClick={() => navigate('/manage-leaves')}>
          Apply Leave
        </button>
        <button className="btn btn-outline btn-warning w-full" onClick={() => navigate('/my-leaves')}>
          My Leave
        </button>
        <button className="btn btn-outline btn-secondary w-full">Change Password</button>
      </div>
    </div>
  );
};

export default Sidebar;
