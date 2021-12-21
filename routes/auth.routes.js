const router = require("express").Router();
const User = require("../models/User.model")
const bcryptjs = require("bcryptjs") //<==== muy muy importante
const mongoose = require('mongoose'); // <== has to be added
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');


router.get("/createUser", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/createUser", async(req, res, next) => {
    const { username, password, email, ...rest } = req.body;

    try {
        if (!username || !password || !email) {
            console.log("upps!!");
            res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
            return;
        }

        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!regex.test(password)) {
            res
                .status(500)
                .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
            return;
        }


        const salt = bcryptjs.genSaltSync(10);
        const newPassword = bcryptjs.hashSync(password, salt);
        const user = await User.create({ username, email, password: newPassword });
        res.redirect(`/profile`);

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
            res.status(500).render('auth/signup', {
                errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            });
        } else {
            next(error);
        }
    }
});

router.get('/login', isLoggedOut, (req, res, next) => {
    res.render("auth/login");
});


router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);

    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, user.password)) {
                const userPs = user.toObject();
                delete userPs['password'];
                req.session.currentUser = userPs;
                res.redirect('/profile');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }
        })
        .catch(error => next(error));
});


router.get("/profile", isLoggedIn, (req, res, next) => {
    res.render('users/profile', { userInSession: req.session.currentUser });
});


router.get("/private", isLoggedIn, (req, res) =>
    res.render("users/private", { userInSession: req.session.currentUser })
);

router.get("/main", isLoggedIn, (req, res) =>
    res.render("users/main", { userInSession: req.session.currentUser })
);

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    });
});

module.exports = router;