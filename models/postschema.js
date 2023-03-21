const mongoose = require("mongoose");


const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true, 
    }
});

const post = new mongoose.model('posts', PostSchema);

module.exports = post;