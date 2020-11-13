const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const User = require("../models/User.model");
const mongoose = require("mongoose");
let session = require('express-session')
const MongoStore = require('connect-mongo')(session);


const saltRounds = 10;


//--------------------------------------->signup section<-----------------------------


//sending a file that will render and display the form to users.
router.get("/signup", (req, res, next) => {
    res.render("signup")
})

// get the information user inputted in the form and properly store them in the database.

router.post("/signup", (req, res, next) => {
    const { username, email, password } = req.body;

    // Validate that incoming data is not empty.
    if (!username || !email || !password) {
        res.render("/signup", {
            email,
            username,
            errorMessage: "All fields are mandatory. Please provide your username, email and password.",
        });
        return;
    }

    const emailFormatRegex = /^\S+@\S+\.\S+$/;

    if (!emailFormatRegex.test(email)) {
        res.status(500).render("signup", {
            email,
            username,
            validationError: "Please use a valid email address.",
        });
        return;
    }

    // Strong password pattern.
    const strongPasswordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    // Validate that incoming password matches regex pattern.
    if (!strongPasswordRegex.test(password)) {
        res.status(500).render("signup", {
            email,
            username,
            errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
        });
        return;
    }

    bcryptjs.hash(password, saltRounds)
        .then((pwHash) => {
            User.create({ username, email, passwordHash: pwHash })
                // add user to session.
                .then((user) => {
                    req.session.user = user;
                    res.redirect("user-profile")
                })

            .catch((error) => {
                if (error instanceof mongoose.Error.ValidationError) {
                    res.status(500).render("signup", {
                        username,
                        validationError: error.message,
                    });
                } else if (error.code === 11000) {
                    res.status(500).render("signup", {
                        username,
                        errorMessage: "Username and email need to be unique. Either username or email is already used.",
                    });
                } else {
                    next(error);
                }
            })
        })
        .catch((err) => next(err));
});




//--------------------------------------->Login section<-----------------------------


//to display the login form to users
router.get('/login', (req, res) => {
    res.render('login')
});



router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);

    // get the data from login form
    const { username, password } = req.body;

    if (username === '' || password === '') {
        res.render('login', {
            username,
            errorMessage: 'Please enter both, username and password to login.'
        });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('login', {
                    username,
                    errorMessage: 'username is not registered. Try with other username.'
                });
                return;
            } else if (
                bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.user = user;
                res.redirect("/user-profile");
                // res.render('user-profile', { user });
            } else {
                res.render('login', {
                    errorMessage: 'Incorrect password.'
                });
            }
        })
        .catch(error => next(error));
});



//--------------------------------------->Main section<-----------------------------

router.get('/main', (req, res, next) => {
    if (req.session.user) {
        res.render('main');
    } else {
        res.redirect('/login')
    }
});


//--------------------------------------->Private section<-----------------------------

router.get('/private', (req, res) => {
    if (req.session.user) {
        res.render('private');
    } else {
        res.redirect('/login')
    }
});



//--------------------------------------->User Profile section<-----------------------------


//render the page of the user after the login.
router.get("/user-profile", (req, res) => {
    res.render("user-profile", { user: req.session.user });
});



//--------------------------------------->Logout section<-----------------------------

router.post("/logout", (req, res) => {
    // Alternative 1 for logging out
    req.session.destroy();
    res.redirect("/");
});





module.exports = router;