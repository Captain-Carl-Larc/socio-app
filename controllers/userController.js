// controllers/userController.js
const User = require('../models/User');

// @desc    Get user profile (protected)
// @route   GET /api/users/:id OR /api/users/me (using req.user.id)
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        // Find user by ID from authenticated request (req.user is set by authMiddleware)
        // Or, if targeting a specific ID in URL params, compare req.user.id with req.params.id for security
        // For now, let's just get the authenticated user's profile
        const user = await User.findById(req.user.id).select('-password'); // Exclude password

        if (user) {
            res.status(200).json({
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                followers: user.followers.length, // Just counts for now
                following: user.following.length // Just counts for now
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error getting user profile' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/me OR /api/users/:id
// @access  Private (only user can update their own profile)
exports.updateUserProfile = async (req, res) => {
    const { username, email, profilePicture, bio } = req.body; // Fields allowed to be updated

    try {
        // Find the user by ID from the authenticated request (req.user.id)
        const user = await User.findById(req.user.id);

        if (user) {
            // Update only allowed fields
            user.username = username || user.username;
            user.email = email || user.email;
            user.profilePicture = profilePicture || user.profilePicture;
            user.bio = bio || user.bio;

            // If email is changed, ensure it's not taken by another user
            if (email && email !== user.email) {
                const existingUserWithEmail = await User.findOne({ email });
                if (existingUserWithEmail && existingUserWithEmail._id.toString() !== user._id.toString()) {
                    return res.status(400).json({ message: 'Email already in use by another user' });
                }
            }
            // If username is changed, ensure it's not taken by another user
            if (username && username !== user.username) {
                const existingUserWithUsername = await User.findOne({ username });
                if (existingUserWithUsername && existingUserWithUsername._id.toString() !== user._id.toString()) {
                    return res.status(400).json({ message: 'Username already in use by another user' });
                }
            }


            // Save the updated user
            const updatedUser = await user.save();

            res.status(200).json({
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    profilePicture: updatedUser.profilePicture,
                    bio: updatedUser.bio
                }
            });

        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};