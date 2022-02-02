const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const router = new Router();

const saltRounds = 10;

//GET route to display signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

//POST route to process form data
router.post("/signup", (req, res, next) => {
    
    const { username, password } = req.body;

    bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(password, salt))
        .then((hashedPassword) => {
            return User.create({
                username,
                passwordHash : hashedPassword,
            });
        })
        .then((userFromDB) => {
            res.redirect('/userProfile');
        })
        .catch((error) => next(error));
});

//GET to render user profile page
router.get("/userProfile", (req,res) => res.render("users/user-profile"));

module.exports = router;