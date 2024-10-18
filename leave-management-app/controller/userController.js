const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Register User
const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // ตรวจสอบ password และ confirmPassword ตรงกันหรือไม่
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER',
            },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'User registration failed' });
    }
};


// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

// Change Password
const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) return res.status(400).json({ error: 'Incorrect old password' });

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while changing the password' });
    }
};

// ดึงโปรไฟล์ผู้ใช้
const getUserProfile = async (req, res) => {
    const userId = req.user.id; // สมมติว่า req.user.id มีอยู่จาก middleware

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true }, // เลือกเฉพาะข้อมูลที่ต้องการส่งกลับ
        });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching user profile' });
    }
};
// Edit User Role
const editUserRole = async (req, res) => {
    const userId = req.params.id; // รับ ID ของผู้ใช้จาก URL
    const { role } = req.body; // รับบทบาทใหม่จาก body

    try {
        // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // อัปเดตบทบาทของผู้ใช้
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating user role' });
    }
};

// Delete User Account
const deleteUserAccount = async (req, res) => {
    const userId = req.params.id; // รับ ID ของผู้ใช้จาก URL

    try {
        // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // ลบผู้ใช้
        await prisma.user.delete({ where: { id: userId } });

        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting user account' });
    }
};

// Edit User Profile
const editUserProfile = async (req, res) => {
    const userId = req.user.id; // ใช้ ID ของผู้ใช้จาก middleware
    const { name, phone, position } = req.body; // รับข้อมูลใหม่จาก body

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, phone, position },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating user profile' });
    }
};

module.exports = { registerUser, loginUser, changePassword, getUserProfile, editUserRole, deleteUserAccount, editUserProfile };
