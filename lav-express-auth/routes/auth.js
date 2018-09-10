const express = require('express');
const router  = express.Router();
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');

/* Return adding user page */
router.get('/signup', (req, res, next) => {
    res.status(200)
        .render('auth/signup');
});

router.post('/signup', async function(req, res, next)  {

    let { username, password } = req.body;

    let validateRes = validateUser({
       username,
       password
    });

    let errorMessage = null;

    if(validateRes) {
         errorMessage = validateRes.details[0].message;
        return res.status(400)
            .render('auth/signup', {
                errorMessage,
                username,
                password
            });
    }

    let user = await User.findOne({ username });

    if(user) {

        errorMessage = "User with this name already exists!"

        return res.status(400)
            .render('auth/signup', {
            errorMessage,
            username,
            password
        });

    } else {

        try {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            user = new User({ username, password });
            const result = await user.save();

            res.status(201)
                .redirect('/');
        } catch(ex) {
            next(ex);
        }

    }

});

/* Return login user page */
router.get('/login', (req, res, next) => {
    res.status(200)
        .render('auth/login');
});

router.post('/login', async function(req, res, next)  {

    let { username, password } = req.body;

    let validateRes = validateUser({
        username,
        password
    });

    let errorMessage = null;

    if(validateRes) {
        errorMessage = validateRes.details[0].message;
        return res.status(400)
            .render('auth/login', {
                errorMessage,
                username,
                password
            });
    }

    let user = await User.findOne({ username });

    if(!user) {

        errorMessage = "There isn't user with such username!";

        return res.status(400)
            .render('auth/login', {
                username,
                password,
                errorMessage
            });

    } else {

        try {
            const resultCompare = await bcrypt.compare(password, user.password);

           if(resultCompare) {

               // Save the login in the session!
               req.session.currentUser = user;
               res.status(200)
                   .redirect("/");

           } else {
               errorMessage = "Incorrect password!";

               res.status(400)
                   .render("auth/login", {
                       errorMessage,
                       username
               });
           }

        } catch(ex) {
            next(ex);
        }

    }

});

router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        // cannot access session here
        res.redirect("/auth/login");
    });
});

module.exports = router;