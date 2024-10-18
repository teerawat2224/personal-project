const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// สร้างใบลา
const createLeave = async (req, res) => {
    const { type, year, startDate, endDate, days, userNote, tasksLink } = req.body;
    const { id: userId, name: userName, email: userEmail, role } = req.user; // ข้อมูลผู้ใช้จาก token ที่ decode
    console.log('User:', req.user);

    // ตรวจสอบว่า startDate และ endDate เป็นวันที่ที่ถูกต้อง
    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required.' });
    }

    // ตรวจสอบว่าข้อมูลผู้ใช้ถูกต้องหรือไม่
    if (!userName || !userEmail) {
        return res.status(400).json({ error: 'User name or email is missing.' });
    }

    // ตรวจสอบบทบาทของผู้ใช้
    if (role !== 'USER' && role !== 'ADMIN') {
        return res.status(403).json({ error: 'You do not have permission to create a leave request.' });
    }

    try {
        const newLeave = await prisma.leave.create({
            data: {
                type,
                year,
                startDate: new Date(startDate),  // แปลงเป็น Date object
                endDate: new Date(endDate),      // แปลงเป็น Date object
                days,
                userId,
                userName,
                userEmail,
                userNote,
                tasksLink,
                status: "PENDING", // ตั้งค่าสถานะเริ่มต้นเป็น PENDING
            },
        });
        res.status(201).json(newLeave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create leave request.' });
    }
};


// ดึงใบลาทั้งหมด
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await prisma.leave.findMany({
            where:{status:"PENDING"},
            include: { user: true },
        });
        res.json(leaves);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch leaves', details: error.message });
    }
};

// อัปเดตใบลา
const updateLeave = async (req, res) => {
    const { id } = req.params;
    const { status, moderator, moderatorNote } = req.body;

    try {
        const leaveExists = await prisma.leave.findUnique({ where: { id } });
        if (!leaveExists) {
            return res.status(404).json({ error: 'Leave not found' });
        }

        const updatedLeave = await prisma.leave.update({
            where: { id },
            data: { status, moderator, moderatorNote },
        });
        res.json(updatedLeave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update leave', details: error.message });
    }
};

// ลบใบลา
const deleteLeave = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.leave.delete({ where: { id } });
        res.status(204).send({ message: 'Leave successfully deleted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete leave', details: error.message });
    }
};

// อัปเดตใบลา (editLeave)
const editLeave = async (req, res) => {
    const { id } = req.params;
    const { type, year, startDate, endDate, days, userNote, tasksLink } = req.body;

    try {
        const leave = await prisma.leave.findUnique({ where: { id } });
        if (!leave) {
            return res.status(404).json({ error: 'Leave not found' });
        }

        // ตรวจสอบสถานะใบลา
        if (leave.status !== 'PENDING') {
            return res.status(400).json({ error: 'Only pending leave requests can be edited' });
        }

        const updatedLeave = await prisma.leave.update({
            where: { id },
            data: {
                type,
                year,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                days,
                userNote,
                tasksLink,
            },
        });

        res.json(updatedLeave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to edit leave request', details: error.message });
    }
};

// ยกเลิกคำขอการลา (cancelLeave)
const cancelLeave = async (req, res) => {
    const { id } = req.params;

    try {
        const leave = await prisma.leave.findUnique({ where: { id } });
        
        if (!leave) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        if (leave.status !== 'PENDING') {
            return res.status(400).json({ error: 'Only pending leave requests can be canceled' });
        }

        const canceledLeave = await prisma.leave.update({
            where: { id },
            data: { status: 'CANCELED' },
        });

        res.json(canceledLeave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to cancel leave request', details: error.message });
    }
};

// อัปเดตสถานะใบลา
const updateLeaveStatus = async (req, res) => {
    const { id } = req.params; // รับ id จากพารามิเตอร์ URL
    const { status } = req.body; // รับสถานะใหม่จาก body ของ request

    try {
        const leaveExists = await prisma.leave.findUnique({ where: { id } });
        if (!leaveExists) {
            return res.status(404).json({ error: 'Leave not found' });
        }

        const updatedLeave = await prisma.leave.update({
            where: { id },
            data: { status }, // อัปเดตสถานะ
        });
        res.json(updatedLeave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update leave status', details: error.message });
    }
};
const getbyuserId = async (req, res) => {
    const { id } = req.params; // รับ id จากพารามิเตอร์ URL

    try {
        const result = await prisma.leave.findMany({ where: { userId:id } });


        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update leave status', details: error.message });
    }
};


// ส่งออกฟังก์ชัน
module.exports = {
    createLeave,
    getAllLeaves,
    updateLeave,
    deleteLeave,
    updateLeaveStatus, // เพิ่มที่นี่
    editLeave,
    cancelLeave,
    getbyuserId,
};
