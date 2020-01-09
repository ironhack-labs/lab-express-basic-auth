const express = require('express');
const router = express.Router();
const User = require('../models/user');

// BCrypt to encrypt passwords
const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;
    
router.get('/', (req, res, next) => {
    res.render( 'auth/login.hbs')
});

router.post("/", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("auth/login.hbs", { errorMessage: "Username and a password not correct" });
        return;
    }

    User.findOne({"username": username})    
        .then(( user ) => {
            if( user === null ) {
                res.render("auth/login.hbs", { errorMessage: "Username and a password not correct" });
            } else {
                if( ! bcrypt.compareSync(password, user.password) ){
                    res.render("auth/login.hbs", { errorMessage: "Username and a password not correct" });
                } else {
                    // Save the login in the session!
                    req.session.currentUser = user;
                    res.redirect("/");
                } 
            }
        })
        .catch(error => {
            console.log(error);
        })
});

module.exports = router;
