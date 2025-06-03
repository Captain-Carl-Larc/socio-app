// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Import your user routes

dotenv.config();
const app = express();
connectDB();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount Authentication Routes
app.use('/api/auth', authRoutes);

// Mount User Routes (protected routes)
app.use('/api/users', userRoutes); // All routes in userRoutes will be prefixed with /api/users

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));