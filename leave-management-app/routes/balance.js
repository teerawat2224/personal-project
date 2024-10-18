const express = require('express');
const router = express.Router();
const balanceController = require('../controller/balanceController');
const authenticateToken = require('../middlewares/authMiddleware');

// เพิ่มยอดคงเหลือ
router.post('/', authenticateToken, async (req, res) => {
    try {
        const balance = await balanceController.addBalance(req.user.id, req.body);
        res.status(201).json(balance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ลดยอดคงเหลือ
router.patch('/deduct', authenticateToken, async (req, res) => {
    try {
        const { leaveDays } = req.body;
        const balance = await balanceController.deductBalance(req.user.id, leaveDays);
        res.json(balance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ดึงยอดคงเหลือ
router.get('/:userId', authenticateToken, async (req, res) => {
    try {
        const balance = await balanceController.getUserBalance(req.params.userId);
        res.json(balance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// รีเซ็ตยอดคงเหลือ
router.post('/reset', authenticateToken, async (req, res) => {
    try {
        await balanceController.resetBalances();
        res.json({ message: 'Balances reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
