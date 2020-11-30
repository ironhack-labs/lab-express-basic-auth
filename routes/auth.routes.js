const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const router = express.Router();
const saltRounds = 10;


router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    
    const {username, email, password} = req.body;

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                email,
                password: hashedPassword
            })
        })
        .then(userFromDB => {
            console.log("new user: ", userFromDB);
            res.redirect("/userProfile")
        })
        .catch( err => next(err))

});

router.get("/userProfile", (req,res,next) => {
    res.render("./auth/user-profile");
})

module.exports = router;