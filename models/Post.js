// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User who created the post
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 500 // Limit post content length
    },
    image: {
        type: String, // URL to the image, if any (optional)
        default: ''
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Array of User IDs who liked this post
    }],
    commentsCount: { // Denormalized field for quick access to comment count
        type: Number,
        default: 0
    }
}, {
    timestamps: true // Mongoose adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Post', PostSchema);