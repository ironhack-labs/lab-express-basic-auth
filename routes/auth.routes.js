const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const mongoose = require("mongoose");
const saltRounds = 10;
const User = require('../models/User.model');

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/*SINGUP*/
router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const { username, email, password, password2} = req.body;

    if(password != password2)
    {
        res.render('auth/signup', {
            errorMessage: 'Both password have to match'
        });
        return;
    }

    // make sure passwords are strong:
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
        .status(500)
        .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                email,
                passwordHash: hashedPassword
            });
        })
        .then(userFromDB => {
            res.redirect('userProfile');
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render('auth/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {
       
              console.log(" Username and email need to be unique. Either username or email is already used. ");
       
              res.status(500).render('auth/signup', {
                 errorMessage: 'must be unquie.'
              });
            } else {
              next(error);
            }
        });

});

router.get('/userProfile', isLoggedIn, (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});


/*LOGIN */
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
    
    User.findOne({ username })
    .then(user => {
      if (!user) {
        console.log("username not registered. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        console.log("Incorrect password. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
      }
    })
    .catch(error => next(error));
})

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
});

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