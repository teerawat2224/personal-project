import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // ตรวจสอบว่ามี token อยู่หรือไม่

  // ถ้ามี token ให้เข้าถึงหน้า home ถ้าไม่มีกลับไปหน้า login
  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
