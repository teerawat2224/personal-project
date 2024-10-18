const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authenticateToken = require('../middlewares/authMiddleware');

// ลงทะเบียนผู้ใช้
router.post('/register', userController.registerUser);

// ล็อกอินผู้ใช้
router.post('/login', userController.loginUser);

// เปลี่ยนรหัสผ่าน
router.patch('/change-password', authenticateToken, userController.changePassword);

// ดึงโปรไฟล์ผู้ใช้
router.get('/profile', authenticateToken, userController.getUserProfile);

// แก้ไขบทบาทผู้ใช้
router.patch('/:id/role', authenticateToken, userController.editUserRole);

// ลบบัญชีผู้ใช้
router.delete('/:id', authenticateToken, userController.deleteUserAccount);

// แก้ไขข้อมูลโปรไฟล์ผู้ใช้
router.patch('/profile', authenticateToken, userController.editUserProfile);


 
module.exports = router;
