const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const saltRounds = 10;

/* GET signup page */
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
    
    const {username, email, password} = req.body;

    if (!username || !password || !email) {
        res.render("auth/signup", {errorMessage: "All fields are mandatory! Please provide email, username and password."});
        return;
    }
    bcrypt.genSalt(saltRounds)
    .then((salt) => {
        return bcrypt.hash(password, salt);
    })
    .then((hash) => {
        return User.create({username, email, pwHash: hash});
    })
    .then(() => {
        res.send("User successfully created!");
    })
    .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', {errorMessage: err.message});
        } else {
            console.log("An error occured while trying to create user account: ", err);
        }
    });
});

module.exports = router;
