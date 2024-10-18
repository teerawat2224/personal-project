// leaveApprovalRoutes.js
const express = require('express');
const router = express.Router();
const { approveLeave, rejectLeave } = require('../controller/leaveApprovalController');
const authenticateToken = require('../middlewares/authMiddleware');

// Route สำหรับอนุมัติใบลา
router.patch('/approve', authenticateToken, approveLeave);

// Route สำหรับปฏิเสธใบลา
router.patch('/reject', authenticateToken, rejectLeave);

module.exports = router;
