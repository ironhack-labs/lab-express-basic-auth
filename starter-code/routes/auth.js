const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const requireAuth = require("../middlewares/requireAuth");

/* GET SIGN IN FORM */

router.get("/signin", (req, res, next) => {
    res.render("auth/signin");
  });

/* HANDLE THE SIGN IN FORM REQUEST */

router.post("/signin", (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;

    if (theUsername === "" || thePassword === "") {
        res.render("auth/signin", {
            errorMessage: "Please enter both username and password to sign up."
        });
        return;
    }
    User.findOne({ "username": theUsername } )
    .then(user => {
        if (!user) {
            res.render("auth/signin", {
                errorMessage: "The username doesn't exist"
            });
            return;
        }
            if (bcrypt.compareSync(thePassword, user.password)) {
                req.session.currentUser = user;
                console.log(user)
                res.redirect("/");
            } else {
                res.render("auth/signin", {
                    errorMessage: "Incorrect password"
                    
                });
            }
        })
        .catch(error => {
            next(error);
        })
});

/* GET SIGN UP FORM */

router.get("/signup", (req, res) => {
    res.render("auth/signup.hbs");
  });

/* SIGN UP */
router.post("/signup", (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and a password to sign up", });
            return;
        }
    User.findOne({ "username": username })
    .then(user => {
        
    if (user !== null) {
        res.render("auth/signup", {
            errorMessage: "The username already exists!",
        });
        return;
    }
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);
        
        User.create({
            username,
            password: hashPass })
            .then(() => {
                res.redirect("/");
            })
        })
        .catch(error => {
            console.log(error);
        })
  
    .catch(error => {
        next(error);
    });


})
    module.exports = router;