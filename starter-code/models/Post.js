const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});


const Post = new mongoose.model("Post", postSchema);

module.exports = Post;