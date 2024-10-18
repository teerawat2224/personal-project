const express = require('express');
const { PrismaClient } = require('@prisma/client'); 
const router = express.Router();
const prisma = new PrismaClient();

// Create Notification
router.post('/', async (req, res) => {
    const { message, userId, leaveId, isRead } = req.body; // เปลี่ยน title และ description เป็น message

    try {
        const notification = await prisma.notification.create({
            data: {
                message,
                userId, // ต้องส่ง userId ที่ถูกต้อง
                leaveId,
                isRead,
            },
        });
        res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error.message); // แสดงข้อความข้อผิดพลาดที่ชัดเจนขึ้น
        res.status(500).json({ error: 'Unable to create notification.' });
    }
});


// Get all notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany();
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to retrieve notifications.' });
    }
});

// Export the router
module.exports = router;
