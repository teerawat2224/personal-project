const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// อนุมัติใบลา (เฉพาะ admin)
const approveLeave = async (req, res) => {
    const { leaveId } = req.body; // รับ leaveId จาก body ของ request
    const moderator = req.user.name; // ชื่อผู้อนุมัติ (moderator) จาก token ที่ถูก decode
    const role = req.user.role; // รับ role ของผู้ใช้งานจาก token

    // ตรวจสอบสิทธิ์ของผู้ใช้ (เฉพาะ ADMIN)
    if (role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied. Only admins can approve leaves.' });
    }

    try {
        const leave = await prisma.leave.update({
            where: { id: leaveId },
            data: {
                status: 'APPROVED', // เปลี่ยนสถานะเป็น APPROVED
                moderator: moderator, // บันทึกชื่อ moderator
            },
        });
        res.status(200).json({ message: 'Leave approved successfully', leave });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve leave', details: error.message });
    }
};

// ปฏิเสธใบลา (เฉพาะ admin)
const rejectLeave = async (req, res) => {
    const { leaveId } = req.body; // รับ leaveId จาก body ของ request
    const moderator = req.user.name; // ชื่อผู้ปฏิเสธ (moderator) จาก token ที่ถูก decode
    const role = req.user.role; // รับ role ของผู้ใช้งานจาก token

    // ตรวจสอบสิทธิ์ของผู้ใช้ (เฉพาะ ADMIN)
    if (role !== 'ADMIN') { 
        return res.status(403).json({ error: 'Access denied. Only admins can reject leaves.' });
    }

    try {
        const leave = await prisma.leave.update({
            where: { id: leaveId },
            data: {
                status: 'REJECTED', // เปลี่ยนสถานะเป็น REJECTED
                moderator: moderator, // บันทึกชื่อ moderator
            },
        });
        res.status(200).json({ message: 'Leave rejected successfully', leave });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject leave', details: error.message });
    }
};

module.exports = { approveLeave, rejectLeave };
