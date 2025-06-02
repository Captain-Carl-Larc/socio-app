// controllers/authController.js
const User = require('../models/User'); // Import the User model
const bcrypt = require('bcryptjs');     // For password hashing
const jwt = require('jsonwebtoken');    // For JWT token generation

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // 1. Basic validation: Check if all required fields are present
    if (!username || !email || !password) {
        // Return 400 Bad Request if fields are missing
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // 2. Check if user already exists: by email or username
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            // Return 400 Bad Request if user exists
            return res.status(400).json({ message: 'User with that email or username already exists' });
        }

        // 3. Hash password: Generate a salt and hash the provided password
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // 4. Create new user instance
        user = new User({
            username,
            email,
            password: hashedPassword // Store the hashed password
        });

        // 5. Save user to the database
        await user.save();

        // 6. Generate JWT token for immediate login after registration
        // (We'll use a helper function for this soon, but for now, inline)
        const token = jwt.sign(
            { id: user._id }, // Payload: user ID
            process.env.JWT_SECRET, // Your secret key from .env
            { expiresIn: '1h' } // Token expiration time (e.g., 1 hour)
        );

        // 7. Send success response with token and user details
        res.status(201).json({ // 201 Created status
            message: 'User registered successfully',
            token,
            user: { // Send back relevant user info (NOT the hashed password)
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio
            }
        });

    } catch (error) {
        console.error(error); // Log the full error for debugging purposes
        res.status(500).json({ message: 'Server error during registration' }); // Generic server error message
    }
};



// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Basic validation: Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // 2. Check if user exists by email
        const user = await User.findOne({ email });
        if (!user) {
            // Return 400 Bad Request if user not found
            return res.status(400).json({ message: 'Invalid credentials (user not found)' });
        }

        // 3. Compare provided password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Return 400 Bad Request if passwords don't match
            return res.status(400).json({ message: 'Invalid credentials (password mismatch)' });
        }

        // 4. Generate JWT token for the authenticated user
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 5. Send success response with token and user details
        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};