import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LeaveRequestPage from './components/LeaveRequestPage'; 
import ManageLeavesPage from './components/LeaveManagement'; // นำเข้า ManageLeavesPage
import PrivateRoute from './components/PrivateRoute'; // นำเข้า PrivateRoute
import MyLeavesPage from './components/Myleave';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/request-leave" 
          element={
            <PrivateRoute>
              <LeaveRequestPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/manage-leaves" 
          element={
            <PrivateRoute>
              <ManageLeavesPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/my-leaves" 
          element={
            <PrivateRoute>
              <MyLeavesPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
