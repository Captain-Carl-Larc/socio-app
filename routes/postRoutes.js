// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Import the authentication middleware
const postController = require('../controllers/postController'); // We will create this controller file next

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (only authenticated users can create posts)
router.post('/', protect, postController.createPost);

// @desc    Get all posts (e.g., for a feed)
// @route   GET /api/posts
// @access  Public (anyone can view posts)
router.get('/', postController.getAllPosts);

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', postController.getPostById);

// @desc    Update a post (only by the post owner)
// @route   PUT /api/posts/:id
// @access  Private
router.put('/:id', protect, postController.updatePost);

// @desc    Delete a post (only by the post owner)
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, postController.deletePost);

// You'll add routes for comments and likes later

module.exports = router;