const express = require('express');
const router = express.Router();
// Pour utiliser notre model
const User = require('../models/user')
// Pour utiliser BCrypt
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* GET home page */ // became Sign up 
router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs');
    // res.render("auth/signup.hbs", {
    //     error: req.flash("error"),
    // });
});


router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
//  const {username, password} = req.body;  1-liner
    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }
    User.findOne({ "username": username }) // or {username:username}
        .then((user) => {
            if (user !== null) {
                // req.flash("error", "The email is already taken...");
                res.render("auth/signup", {
                    errorMessage: "The username already exists!"
                });
                return;
            }
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);
            User.create({
                username,   // same as "username: username", it associates the variable name to the key
                password: hashPass
            })
                .then((dbResult) => {
                    res.redirect('/')
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch(error => {
            next(error);
    })
});


// Sign in

router.get('/login', (req, res, next) => {
    res.render('auth/login.hbs')
    // res.render('auth/login.hbs', {
    //     // error: req.flash("error"),
    // });
});

router.post("/login", (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;

    if (theUsername === "" || thePassword === "") {
        res.render("auth/login", {
            errorMessage: "Please enter both, username and password to sign up."
        });
        return;
    }

    User.findOne({
            "username": theUsername
        })
        .then(user => {
            if (!user) {
                // req.flash("error", "Invalid credentials....");
                res.render("auth/login", {
                    errorMessage: "The username doesn't exist."
                });
                return;
            }
            if (bcrypt.compareSync(thePassword, user.password)) {
                // !!!!!!Save the login in the session!!!!!!!!! in the next line
                // Note how we create the user session;
                // the request object has a property called 'session'
                // where we can add the values we want to store on it
                // In this case, we are setting it up with the 'user'’ s information.
                req.session.currentUser = user;   // currentUser could be called anything
                res.redirect("/");
                // The presence of the user’s information in the session
                // is what we are going to use to check for a logged in user in the other parts of the app
                // if (req.session.currentUser === user) ==> USER IS LOGGED IN
                // Once the user is logged in, we will redirect him to the main page
            } else {
                // req.flash("error", "Invalid credentials...");
                res.render("auth/login", {
                    errorMessage: "Incorrect password"
                });
            }
        })
        .catch(error => {
            next(error);
        })
});

// Logout

router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        // cannot access session here
        res.redirect("/login");
    });
});

module.exports = router;
