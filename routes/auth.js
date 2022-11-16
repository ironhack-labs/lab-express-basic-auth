/* -------------------------------- */
/* 0. Retrieve models and packages  */
/* -------------------------------- */

const router = require("express").Router();
const User   = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { rawListeners } = require("../app");

/* -------------------------------- */
/* 1. Signup                        */
/* -------------------------------- */

// Create route
router.get("auth/signup", (req, res, next) => {
    res.render("signup");
})

// Post username and password requirements
router.post("auth/signup", (req, res, next) => {
    const { username, password } = req.body;

    if (username === "") {
        res.render("signup", { message: "Username cannot be empty!"});
        return;
    }

    if (password.length < 12) {
        res.render("signup", { message: "Your password is too weak! It should contain at least 12 characters"});
        return;
    }
})


/* -------------------------------- */
/* 2.1. Login                       */
/* -------------------------------- */

// Create route
router.get("auth/login", (req, res, next) => {
    res.render("login");
})

router.post("auth/login", (req, res, next) => {
    const { username, password } = req.body;

    User.findOne({ username })
    .then(userInDb => {
        if (userInDb === null) {
            res.render("login", { message: "Wrong username or password" });
            return;
        }
        if (bcrypt.compareSync(password, userInDb.password)) {
            req.session.user = userInDb;
            res.redirect("profile");
        }
        else {
            res.render("login", { message: "Wrong username or password"} );
            return;
        }
    })
    .catch(err => next(err));
});


/* -------------------------------- */
/* 2.2. Logout                      */
/* -------------------------------- */

router.get("auth/logout", (req, res, next) => {
    req.session.destroy();
    res.render("/logout");
})