// seed.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const hashedPassword = bcrypt.hashSync('123456', 10);

const userData = [
    {
        name: 'Andy Codecamp',
        email: 'andy@ggg.mail',
        password: hashedPassword,
        role: 'USER'
    },
    {
        name: 'Bobby Codecamp',
        email: 'bobby@ggg.mail',
        password: hashedPassword,
        role: 'USER'
    },
];

async function run() {
    console.log('Seeding data...');

    for (const user of userData) {
        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                emailVerified: new Date(),
                password: user.password,
                role: user.role,
            },
        });
    }
    console.log('Seeding completed.');
    await prisma.$disconnect();
}

run();
