// controllers/authController.js
// For now, just a placeholder. We will add the actual logic later.

exports.registerUser = (req, res) => {
    // This function will contain the logic to create a new user
    // For testing, let's just send a simple response
    res.status(200).json({ message: 'Register user route hit!' });
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

// You'll add more controller functions here (e.g., loginUser)