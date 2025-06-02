// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Removes whitespace from both ends of a string
        minlength: 3 // Minimum length for username
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Store emails in lowercase
        match: [/.+@.+\..+/, 'Please fill a valid email address'] // Basic email regex
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // This will store the HASHED password
    },
    profilePicture: {
        type: String,
        default: 'https://placehold.co/150x150/cccccc/ffffff?text=Avatar' // Default avatar
    },
    bio: {
        type: String,
        maxlength: 200, // Max length for user's bio
        default: ''
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Array of User IDs who follow this user
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Array of User IDs this user is following
    }]
}, {
    timestamps: true // Mongoose adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('User', UserSchema);