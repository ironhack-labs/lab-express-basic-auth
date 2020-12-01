const {
    Router
} = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const e = require('express');
const {
    Mongoose
} = require('mongoose');


//////////// S I G N U P ///////////
router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    const {
        username,
        password
    } = req.body;
    if (username === '' | password === '') {
        res.render('auth/signup', {
            errorMessage: 'Oops! You forgot to enter a username and password.'
        });
        return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)
            .render('auth/signup', {
                errorMessage: `Password needs at least 6 characters and must consist of at least one number, one lowercase and one uppercase letter`
            });
        return
    }

    bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(password, salt))
        .then((hashedPassword) => {
            return User.create({
                username,
                passwordHash: hashedPassword
            });
        })
        .then((userFromDB) => {
            res.redirect('/userProfile');
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', {
                    errorMessage: `This username already exists`
                });
            } else {
                next(error);
            }
        });
});


//////////// L O G I N ///////////
router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    const {
        username,
        password
    } = req.body;

    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Oops! You forgot to enter a username and password.'
        });
        return;
    }

    User.findOne({
            username
        })
        .then((userFromDB) => {
            if (!userFromDB) {
                res.render('auth/login', {
                    errorMessage: 'This username is not registered. Please use a different one.'
                });
                return;
            } else if (bcryptjs.compareSync(password, userFromDB.passwordHash)) {
                req.session.currentUser = userFromDB;
                res.redirect('/userProfile');
            } else {
                res.render('auth/login', {
                    errorMessage: 'Password is invalid.'
                });
            }
        })
        .catch((error) => next(error));
});


//////////// U S E R  P R O F I L E ///////////
router.get('/userProfile', (req, res, next) => {
    if (req.session.currentUser) {
        res.render('users/user-profile', {
            userInSession: req.session.currentUser
        });
    } else {
        res.render('users/user-profile', {
            errorMessage: `You're not logged in`
        });
    }
});


//////////// L O G O U T ///////////
router.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});

//////////// P R O T E C T E D ///////////
router.get('/main', (req, res, next) => {
    if (req.session.currentUser) {
        res.render('users/main', {
            userInSession: req.session.currentUser
        });
    } else {
        res.render('users/main', {
            errorMessage: `You're not logged in`
        });
    }
});

router.get('/private', (req, res, next) => {
    if (req.session.currentUser) {
        res.render('users/private', {
            userInSession: req.session.currentUser
        });
    } else {
        res.render('users/private', {
            errorMessage: `You're not logged in`
        });
    }
});



module.exports = router;