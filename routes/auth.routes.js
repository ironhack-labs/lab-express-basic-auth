const { Router } = require('express')
const router = new Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

const User = require('../models/User.model')
const saltRounds = 10

router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'))

router.get('/userProfile', (req, res) => res.render('users/user-profile'))

// POST
router.post('/signup', (req, res) => {

    const { username, password } = req.body;
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (!regex.test(password)) {
        res
        .status(500)
        .render('auth/signup', { error: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
        res.render('auth/login')
        return User.create({
            username,
            password: hashedPassword
        })
    })
    .catch(e => {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render("auth/signup", { errorMessage: error.message });
        } else if (error.code === 11000) {
            res.status(500).render("auth/signup", {
              errorMessage: "Username and email need to be unique. Either username or email is already used."
            });
        } else next(error)
    })

});

router.get("/login", isLoggedOut, (req, res) => res.render("auth/login"));

router.post("/login", isLoggedOut, (req, res, next) => {
    console.log("SESSION =====> ", req.session);
    const { username, password } = req.body;
  
    if (username === "" || password === "") {
        res.render("auth/login", { error: "Please enter both, username and password to login." });
        return;
    }
  
    User.findOne({ username }) // <== check if there's user with the provided email
        .then((user) => {
        // <== "user" here is just a placeholder and represents the response from the DB
            if (!user) {
            // <== if there's no user with provided email, notify the user who is trying to login
                res.render("auth/login", { error: "This Username is not registered. Try with other email." });
                return;
            }
            // if there's a user, compare provided password
            // with the hashed password saved in the database
            else if (bcryptjs.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.redirect("/userProfile");
            } else {
            // if the two passwords DON'T match, render the login form again
            // and send the error message to the user
            res.render("auth/login", { error: "Incorrect password." });
            }
        })
        .catch((error) => next(error));
    }
);

router.get("/userProfile", isLoggedIn, (req, res) => {
        res.render("users/user-profile", { userInSession: req.session.currentUser });
    }
);

router.get('/main', isLoggedIn, (req, res, next) => res.render('users/main'))
router.get('/private', isLoggedIn, async (req, res, next) => res.render('users/private'))

router.post("/logout", isLoggedIn, (req, res) => {
    req.session.destroy();
    res.redirect("/");
  }
);

module.exports = router