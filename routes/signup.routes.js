const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

/* GET signup page */
router.get('/signup', (req, res, next) => res.render('signup'));

// POST signup page 

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create(
          {username, passwordHash: hashedPassword}
      )
    })
    .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
      })
    .catch(error => next(error));}
    )


router.get('/login', (req, res, next) => res.render("login"))



router.post('/login', (req, res, nex) => {

    console.log('SESSION =====> ', req.session);
    const {username, password} = req.body;

    if (username === '' || password === '') {
        res.render("login", {errorMessage: 'Please enter both, username and password to login.' })
        return;
    }

    User.findOne({username})
    .then(user => {
        if (!username) {
            res.render('login', {errorMessage: 'Please enter correct username to login.' })
            return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('user-profile');    
        } else {
            res.render('login', { errorMessage: 'Incorrect password.' });
          }
    })
    .catch(error => next(error));   
})

router.get('/profile', (req, res, next) => {
    res.render('user-profile', { userInSession: req.session.currentUser });
})

module.exports = router;