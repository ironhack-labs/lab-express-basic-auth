const express = require('express');
const router = express.Router();
const User = require('../models/user');

// BCrypt to encrypt passwords
const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;
    
router.get('/', (req, res, next) => {
    res.render( 'auth/signup.hbs')
});

router.post("/", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("auth/signup.hbs", { errorMessage: "Indicate a username and a password to sign up" });
        return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.findOne({"username": username})    
        .then(( user ) => {
            if( user !== null ) {
                res.render("auth/signup.hbs", { errorMessage: "Entered username already exist" });
                return;
            }
            User.create({
                username,
                password: hashPass
            })
            .then(() => {
                res.redirect("/");
            })
        })
        .catch(error => {
            console.log(error);
        })
});

module.exports = router;