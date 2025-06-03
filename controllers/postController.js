// controllers/postController.js
const Post = require('../models/Post'); // Import the Post model
const User = require('../models/User'); // Import the User model (for population)
const mongoose = require('mongoose'); // Needed for isValidObjectId check

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
    const { content, image } = req.body; // Destructure content and optional image URL from request body

    // 1. Basic validation: Ensure content is provided
    if (!content) {
        return res.status(400).json({ message: 'Post content is required' });
    }

    try {
        // 2. Create a new post instance
        // req.user.id comes from the 'protect' middleware after JWT verification
        const newPost = new Post({
            user: req.user.id, // Assign the ID of the authenticated user
            content,
            image: image || '' // Use provided image URL or default to empty string
        });

        // 3. Save the post to the database
        const savedPost = await newPost.save();

        // 4. Populate the 'user' field to send back user details with the post
        // We select only username, profilePicture, and id for the user
        const populatedPost = await savedPost.populate('user', 'username profilePicture');

        // 5. Send success response with the created post
        res.status(201).json({
            message: 'Post created successfully',
            post: populatedPost
        });

    } catch (error) {
        console.error(error); // Log the full error for debugging
        res.status(500).json({ message: 'Server error creating post' }); // Generic server error
    }
};

// @desc    Get all posts (e.g., for a feed)
// @route   GET /api/posts
// @access  Public
exports.getAllPosts = async (req, res) => {
    try {
        // 1. Fetch all posts, sorted by creation date (newest first)
        // .populate('user', 'username profilePicture') will replace the user ID with actual user data
        const posts = await Post.find()
            .sort({ createdAt: -1 }) // Sort by creation date, descending
            .populate('user', 'username profilePicture'); // Populate user details

        // 2. Send the array of posts as a response
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching posts' });
    }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
exports.getPostById = async (req, res) => {
    // 1. Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid post ID format' });
    }

    try {
        // 2. Find the post by its ID and populate the user details
        const post = await Post.findById(req.params.id)
            .populate('user', 'username profilePicture'); // Populate user details

        // 3. Check if the post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 4. Send the found post as a response
        res.status(200).json({
            message: 'Post fetched successfully',
            post
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching post' });
    }
};

// @desc    Update a post (only by the post owner)
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
    // 1. Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid post ID format' });
    }

    const { content, image } = req.body; // Destructure updatable fields

    try {
        // 2. Find the post by ID
        let post = await Post.findById(req.params.id);

        // 3. Check if the post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 4. Check if the authenticated user is the owner of the post
        // req.user.id is a string, post.user is an ObjectId, so convert post.user to string for comparison
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this post' }); // 403 Forbidden
        }

        // 5. Update post fields (only if provided in the request body)
        post.content = content || post.content; // Update content if provided
        post.image = (image !== undefined) ? image : post.image; // Update image (allow clearing it with empty string)

        // 6. Save the updated post
        const updatedPost = await post.save();

        // 7. Populate the 'user' field for the response
        const populatedUpdatedPost = await updatedPost.populate('user', 'username profilePicture');

        // 8. Send success response
        res.status(200).json({
            message: 'Post updated successfully',
            post: populatedUpdatedPost
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating post' });
    }
};

// @desc    Delete a post (only by the post owner)
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
    // 1. Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid post ID format' });
    }

    try {
        // 2. Find the post by ID
        const post = await Post.findById(req.params.id);

        // 3. Check if the post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 4. Check if the authenticated user is the owner of the post
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' }); // 403 Forbidden
        }

        // 5. Delete the post
        await Post.deleteOne({ _id: req.params.id }); // Using deleteOne for clarity

        // 6. Send success response
        res.status(200).json({ message: 'Post deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting post' });
    }
};