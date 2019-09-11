const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


//================= SIGNUP
router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post("/signup", (req, res, next) => {
    const {
        username,
        password
    } = req.body

    if (!username) {
        res.render("signup", {
            message: "Please give Username"
        })
    }

    User.findOne({
        username: username
    }).then(found => {
        if (found) {
            res.render("signup", {
                message: "Allready exist"
            });
            return;
        } else {
            // we can create a user with the username and password pair
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);

            User.create({
                    username: username,
                    password: hash
                })
                .then(dbUser => {
                    res.redirect("/");
                })
                .catch(err => {
                    next(err);
                });

        }
    })
})




//================= LOGIN

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
        username: username
    }).then(found => {
        if (found === null) {
            // no user in the collection has this username
            res.render("login", {
                message: "Invalid credentials"
            });
            return;
        }
        if (bcrypt.compareSync(password, found.password)) {
            // password and hash match
            req.session.user = found;
            res.redirect("/");
        } else {
            res.render("login", {
                message: "Invalid credentials"
            });
        }
    });
});


module.exports = router;