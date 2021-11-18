const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require('bcryptjs');
const zxcvbn = require('zxcvbn');
const isLoginTrue = require('./../middleware/isLoginTrue');


const SALT_ROUNDS = 10;

//! Routes:
//*Get /signup

router.get("/signup", (req, res) => {
    res.render("auth/signup-form");
});

//*Post /signup
router.post("/signup", (req, res) => {
    const { username, password } = req.body;

    const usernameMissing = !username || username === "";
    const passwordMissing = !password || password === "";

    if (usernameMissing && passwordMissing) {
        res.render("auth/signup-form", {
            errorMessage: "Please define an username"
        })
        return;
    }
    const passwordExists = zxcvbn(password);
    // console.log("passwordExists", passwordExists);
    if (passwordExists.score < 3) {
        res.render("auth/signup-form", { errorMessage: "Password too weak, try another one." })
    }

    User.findOne({ username: username })
        .then((theUser) => {
            if (theUser) {
                throw new Error("You have to choose another username!")
            }
            return bcrypt.genSalt(SALT_ROUNDS);
        })
        .then((salt) => {
       

            return bcrypt.hash(password, salt);
        })
        .then(hashedPassword => {
          
            return User.create({ username: username, password: hashedPassword });
        })
        .then((createdUser) => {
            res.render("index", { createdUser });
        })
        .catch((err) => {
            //console.log("err.message", err.message);
            res.render("auth/signup-form", { errorMessage: err.message || "Error while trying to sign up" })
        })
})

//*Get/login
router.get("/login", (req, res) => {
    res.render("auth/login-form");
})

//*Post/login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const usernameMissing = !username || username === "";
    const passwordMissing = !password || password === "";

    if (usernameMissing && passwordMissing) {
        res.render("auth/login-form", {
            errorMessage: "Please provide an username and password.",
        })
        return;
    }
    let user;
    User.findOne({ username: username })
        .then((existingUser) => {
            user = existingUser;
            if (!existingUser) {
                throw new Error("Wrong credentials!");
            }
            return bcrypt.compare(password, existingUser.password);
        })
        .then((isTheCorrectPassword) => {
            if (!isTheCorrectPassword) {
                throw new Error("Wrong credentials!");
            }
            else if (isTheCorrectPassword) {
                req.session.user = user;
                res.redirect('/');
            }
        })
        .catch((err) => {
            console.log("err.message", err.message);
            res.render("auth/signup-form", { errorMessage: err.message || "Provide username and password." })
        });
})

//*Get /Logout
router.get('/logout', isLoginTrue, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.render("error");
        }
        //if the session was deleted successfully redirect back to the home page.
        res.redirect('/');
    })
})

router.get("/private", (req, res) => {
    res.render("auth/private-page");
})

module.exports = router;