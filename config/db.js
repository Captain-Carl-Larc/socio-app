const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI
    await mongoose.connect(dbURI);
    console.log('MongoDB connected successfully');
    // Optionally, you can set mongoose options here
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// Export the connectDB function
module.exports = connectDB;