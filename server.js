// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // Import your auth routes

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
    const requestMethod = req.method; // Get the HTTP method of the request
    res.send('API is running...');
    //res.status(200).json({ message: 'API is running...', method: requestMethod });
});

// Mount Authentication Routes
app.use('/api/auth', authRoutes); // All routes in authRoutes will be prefixed with /api/auth

// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));