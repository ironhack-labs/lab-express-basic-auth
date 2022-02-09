const router = require("express").Router();
const bcrypt = require('bcryptjs');
const { findOne } = require("../models/User.model.js");
const User = require('../models/User.model.js')


router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.post("/signup", (req, res, next) => {
    const { username, password } = req.body
    if (username.length === 0) {
		res.render('signup', { message: 'You need a username' })
		return
    }

    // after vallidation I should verify if I got a user with that username in DB
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render("signup", { message: "That username is already taken"})
            } else {
                // using that username
                // and hash the password
                const salt = bcrypt.genSaltSync()
                const hash = bcrypt.hashSync(password, salt)
                
                //create the user
                User.create({ username, password: hash })
                    .then(createdUser => {
                        res.redirect("/login")
                    })
                    .catch(err => next(err))
            }
        })

});




module.exports = router;

