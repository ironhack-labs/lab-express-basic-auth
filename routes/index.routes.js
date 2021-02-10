const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

/* GET home page */
router.get("/", (req, res, next) => {
    const user = req.session.user;
    console.log('WHAT', req.session)
    res.render("index", { user: user });
});

//sign up
router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    if (password.length < 8) {
        return res.render('signup', { message: 'Your password has to be 8 chars min' });
    }
    if (username === '') {
        res.render('signup', { message: 'Your username cannot be empty' });
        return
    }

    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render('signup', { message: 'Username is already taken' });
            } else {
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt)
                User.create({ username: username, password: hash })
                    .then(userFromDB => {
                        console.log(userFromDB);
                        res.redirect('/');
                    })
            }
        })
        .catch(err => {
            console.log(err);
        })
})

//log in
router.get("/login", (req, res, next) => {
    res.render("login");
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB === null) {
                res.render('login', { message: 'Invalid credentials' });
                return;
            }
            if (bcrypt.compareSync(password, userFromDB.password)) {
                req.session.user = userFromDB;
                res.redirect('/main');
            } else {
                res.render('login', { message: 'Invalid credentials' });
            }
        })
})


//iteration 3 - middleware
const loginCheck = () => {
    return (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}

router.get('/main', loginCheck(), (req, res) => {
    res.render('main');
})

router.get('/private', loginCheck(), (req, res) => {
    res.render('private');
})

module.exports = router;