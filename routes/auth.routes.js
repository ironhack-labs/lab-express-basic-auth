const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const {username, email, password} = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => { 
        return User.create({username, email, passwordHash: hashedPassword
        });
}) 
.then(userFromDB => {
    res.redirect('/user');
})
.catch(error => next(error));
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if ( email === '' || password === '' ) {
        response.render('auth/login', {
            errorMessage: 'Enter email and password'
        });
        return
    }

    User.findOne({ email })
    .then(user => {
        if (!user) {
            res.render('auth/login', {errorMessage: 'User not found or the password is incorrect.' })
            return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
            res.render('users/user', {user});
            req.session.currentUser = user;
             res.redirect('/userProfile');
        } else {
            res.render('auth/login', {errorMessage: 'User not found or the password is incorrect.' })
        }
    })
    .catch(error => next(error));
})

router.get('/user', (req, res) => {
    res.render('users/user', { userInSession: req.session.currentUser });
  });

module.exports = router;