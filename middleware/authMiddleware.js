// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // To fetch user details based on ID from token

const protect = async (req, res, next) => {
    let token;

    // Check for token in 'Authorization' header (Bearer Token format)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]; // Extract token part after 'Bearer '

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodes the token with secret

            // Attach user to the request object (excluding password)
            // This makes user data available in subsequent middleware/controllers
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move to the next middleware or route handler

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' }); // Token invalid/expired
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' }); // No token provided
    }
};

module.exports = { protect };