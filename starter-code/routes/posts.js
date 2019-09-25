const express = require('express');
const router = express.Router();
const User = require(__dirname + "/../models/User.js");
const Post = require(__dirname + "/../models/Post.js");



router.get("/", (req, res) => {
    // Post.find().populate("author")

})
router.post("/", (req, res, next) => {
    const {
        title,
        content
    } = req.body;
    debugger
    const author = req.session.user._id;

    Post.create({
            title,
            content,
            author
        }).then(post => {
            debugger
            return User.findByIdAndUpdate(
                author, {
                    $push: {
                        posts: post._id
                    }
                }, {
                    new: true
                }
            );
        })
        .then(updatedUser => {
            res.redirect("/dogsPage");
        });
});


module.exports = router;