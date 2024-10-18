const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ฟังก์ชันเพิ่มยอดคงเหลือ
const addBalance = async (userId, balanceData) => {
    try {
        const year = String(new Date().getFullYear());
        const existingBalance = await prisma.balances.findUnique({
            where: { userId_year: { userId, year } },
        });

        if (existingBalance) {
            throw new Error('Balance already exists for this year');
        }

        return await prisma.balances.create({
            data: {
                userId,
                year,
                ...balanceData,
            },
        });
    } catch (error) {
        throw new Error('Failed to add balance: ' + error.message);
    }
};

// ฟังก์ชันลดยอดคงเหลือ
const deductBalance = async (userId, leaveDays) => {
    const balance = await getBalanceByUserId(userId);

    if (balance.annualAvailable < leaveDays) {
        throw new Error('Insufficient balance');
    }

    try {
        return await prisma.balances.update({
            where: { userId_year: { userId, year: String(new Date().getFullYear()) } },
            data: { annualAvailable: balance.annualAvailable - leaveDays },
        });
    } catch (error) {
        throw new Error('Failed to deduct balance: ' + error.message);
    }
};

// ฟังก์ชันคืนยอดคงเหลือให้กับผู้ใช้ทุกต้นเดือน
const resetBalances = async () => {
    try {
        const users = await prisma.user.findMany();
        await Promise.all(users.map(async (user) => {
            await updateOrCreateBalance(user.id, {
                annualCredit: 10,
                annualAvailable: 10,
            });
        }));

        console.log('Balances reset successfully');
    } catch (error) {
        console.error('Failed to reset balances:', error.message);
    }
};

// ฟังก์ชันอัปเดตหรือสร้างยอดคงเหลือ
const updateOrCreateBalance = async (userId, balanceData) => {
    try {
        return await prisma.balances.upsert({
            where: { userId_year: { userId, year: String(new Date().getFullYear()) } },
            update: balanceData,
            create: {
                userId,
                year: String(new Date().getFullYear()),
                ...balanceData,
            },
        });
    } catch (error) {
        throw new Error('Failed to update or create balance: ' + error.message);
    }
};

const getBalanceByUserId = async (userId) => {
    const year = String(new Date().getFullYear());
    try {
        const balance = await prisma.balances.findUnique({
            where: {
                userId_year: { userId, year },
            },
        });

        if (!balance) {
            throw new Error('Balance not found for user');
        }
        
        return balance;
    } catch (error) {
        throw new Error('Failed to fetch user balance: ' + error.message);
    }
};  

// ฟังก์ชันลบยอดคงเหลือ
const deleteBalance = async (userId) => {
    try {
        await prisma.balances.delete({
            where: { userId_year: { userId, year: String(new Date().getFullYear()) } },
        });
    } catch (error) {
        throw new Error('Failed to delete balance: ' + error.message);
    }
};

const getUserBalance = async (userId) => {
    try {
        const balance = await prisma.balances.findUnique({
            where: { userId_year: { userId, year: String(new Date().getFullYear()) } },
        });

        if (!balance) {
            throw new Error('Balance not found for user');
        }
        
        return balance;
    } catch (error) {
        throw new Error('Failed to fetch user balance: ' + error.message);
    }
};

module.exports = {
    addBalance,
    deductBalance,
    getBalanceByUserId,
    deleteBalance,
    resetBalances,
    getUserBalance
};
