// resetDB.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetDB() {
    console.log('Resetting database...');
    await prisma.$executeRawUnsafe('DROP DATABASE IF EXISTS leave_management_db');
    await prisma.$executeRawUnsafe('CREATE DATABASE leave_management_db');
    console.log('Database reset completed.');
    await prisma.$disconnect();
}

resetDB();
