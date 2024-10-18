const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role
        }; 
        next();
    });
};

module.exports = validateToken;
