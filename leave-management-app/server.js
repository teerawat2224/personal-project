require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client'); 
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const balanceRoutes = require('./routes/balance');
const leaveApprovalRoutes = require('./routes/leaveApprovalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 8800;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Welcome to the Leave Management API');
});

// ใช้ routes ต่าง ๆ
app.use('/api/users', userRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/leavesApp', leaveApprovalRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging
    res.status(500).json({ error: 'Something went wrong!' }); // Send a generic error message
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
