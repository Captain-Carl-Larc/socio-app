// routes/authRoutes.js
const express = require('express');
const router = express.Router(); // Create an Express Router instance

// We will create this controller file next, for now just a placeholder
const authController = require('../controllers/authController');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authController.registerUser);

// You'll add more routes here later (e.g., login)
router.post('/login', authController.loginUser);
module.exports = router;