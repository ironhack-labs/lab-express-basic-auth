const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const saltRounds = 10;

/* GET signup page */
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
    
    const {username, email, password} = req.body;

    if (!username || !password || !email) {
        // set username = email in case it is not provided instead
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

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post("/login", (req, res) => {

    const {username, password} = req.body;

    if (!username || !password) {
        res.render("auth/login", {errorMessage: "Please provide username/email and password."})
    }

    User.findOne({"$or": [{"username": username}, {"email": username}]})
    .then((user) => {
        console.log(user);
        if (!user) {
            res.render("auth/login", {errorMessage: "Username incorrect."});
        } else if (bcrypt.compareSync(password, user.pwHash)) {
            res.send("login successful");
        } else {
            res.render("auth/login", {errorMessage: "Password incorrect."});
        }
    })
    .catch((err) => {
        console.log("Something went wrong logging in the User: ", err);
    });

});