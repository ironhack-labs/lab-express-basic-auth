const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');


/* *** SINGUP routes *** */
// Get route
router.get('/signup', (req, res) => res.render('auth/signup'));

// Post route
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                passwordHash: hashedPassword
            });
        })
        .then(userFromDB => {
            res.redirect('userProfile');
        })
        .catch(error => next(error));

});

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', {userInSession: req.session.currentUser});
});


/* *** LOGIN routes *** */
router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { username, password } = req.body;

    if(username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please, enter both, username and password to login'
        });
        return;
    }
    User.findOne({username})
        .then(user => {
            if(!user) {
                console.log('User not registered');
                res.render('auth/login', {
                    errorMessage: 'User not found and/or incorrect password 🤪 👆'
                });
                return;
            }
            else if (bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('/userProfile');
            } else {
                console.log('Incorrect password ');
                res.render('auth/login', {errorMessage: 'User not found and/or incorrect password 🤪 👆'});
            }
        })
        .catch(error => next(error));
})

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('/login'); 
    }
};

router.get('/main', isAuthenticated, (req, res) => {
    res.render('/main', { userInSession: req.session.currentUser });
});

router.get('/private', isAuthenticated, (req, res) => {
    res.render('/private', { userInSession: req.session.currentUser });
});

module.exports = router;