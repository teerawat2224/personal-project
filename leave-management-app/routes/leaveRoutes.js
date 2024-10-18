const express = require('express');
const {
    createLeave,
    getAllLeaves,
    updateLeave,
    deleteLeave,
    updateLeaveStatus,
    editLeave,
    cancelLeave,
    getbyuserId,
} = require('../controller/leaveController');
const validateToken = require('../middlewares/auth');

const router = express.Router();


const authorizeUserOrAdmin = (req, res, next) => {
    const role = req.user.role; 
    if (role === 'USER' || role === 'ADMIN') {
        return next(); 
    }
    return res.status(403).json({ error: 'Access denied. Only users or admins can access this resource.' });
};


router.post('/', validateToken, authorizeUserOrAdmin, createLeave);


router.get('/', validateToken, (req, res, next) => {
    if (req.user.role === 'ADMIN') {
        return next(); 
    }
    return res.status(403).json({ error: 'Access denied. Only admins can access this resource.' });
}, getAllLeaves);

router.get('/:id', validateToken, getbyuserId);


router.put('/:id', validateToken, authorizeUserOrAdmin, updateLeave);


router.delete('/:id', validateToken, (req, res, next) => {
    if (req.user.role === 'ADMIN') {
        return next(); 
    }
    return res.status(403).json({ error: 'Access denied. Only admins can delete leaves.' });
}, deleteLeave);


router.patch('/:id/status', validateToken, (req, res, next) => {
    if (req.user.role === 'ADMIN') {
        return next(); 
    }
    return res.status(403).json({ error: 'Access denied. Only admins can update leave status.' });
}, updateLeaveStatus);

// Route สำหรับแก้ไขข้อมูลใบลา (เฉพาะ user ที่เป็นเจ้าของใบลา หรือ admin)
router.patch('/:id/edit', validateToken, authorizeUserOrAdmin, editLeave);

// Route สำหรับยกเลิกใบลา (เฉพาะ user ที่เป็นเจ้าของใบลา หรือ admin)
router.patch('/:id/cancel', validateToken, authorizeUserOrAdmin, cancelLeave);

module.exports = router;
