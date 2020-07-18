const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;
const sessionMiddleware = require('../configs/session.config')
 
// .get() route ==> to display the signup form to users
router.get('/signup', (req,res, next) => {
    res.render('auth/signup')
})
 
// .post() route ==> to create the user
router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(password, salt))
        .then((hashedPassword) => {
            return User.create({
                username,
                password: hashedPassword

            })
        })
        .then((userFromDB) => {
            console.log('Newly created user is: ', userFromDB)
            res.redirect('/userProfile')
        })
        .catch(error => next(error))
})

// .get() route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// .post() login route ==> to process form data
router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { username, password } = req.body;
   
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.',
      });
      return;
    }
   
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
          return;
        } else if (bcryptjs.compareSync(password, user.password)) {
            req.session.currentUser = user;
            req.session.userId = user._id
            
            res.redirect('/userProfile');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch((error) => next(error));
});

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

router.get('/main', sessionMiddleware.isAuthenticated, (req, res) => {
    res.render('protected/main');
});

router.get('/private', sessionMiddleware.isAuthenticated, (req, res) => {
    res.render('protected/private');
});


router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;