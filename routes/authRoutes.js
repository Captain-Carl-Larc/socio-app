// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authController.registerUser);

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authController.loginUser); // New login route

module.exports = router;