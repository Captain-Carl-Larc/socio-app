// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware
const userController = require('../controllers/userController'); // Import the user controller

// @desc    Get authenticated user's profile
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, userController.getUserProfile);

// @desc    Update authenticated user's profile
// @route   PUT /api/users/me
// @access  Private
router.put('/me', protect, userController.updateUserProfile);


// You can also have a route for getting *any* user profile by ID (public) later
// router.get('/:id', userController.getUserPublicProfile);

module.exports = router;