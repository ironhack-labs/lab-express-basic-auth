const router = require("express").Router();
const mongoose = require('mongoose');
//our model
const User = require("../models/User.model");
//need for encripting
const bcrypt = require('bcryptjs');
//our middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');

router.get('/signup', (req, res, next) => {
    res.render('signup'); // <=== THIS IS THE NAME OF THE PAGE IN VIEWS
})

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body; // collecting data from the FORM
    // validation 
    if(username === '') {
        res.render('signup', {message: "Oh no, username is to short..."});
        return;
    }
    if(password.length < 5) {
        res.render('signup', {message: "Oh no, you need some longer password..."});
        return;
    }
    // actual creating 
    User.findOne({username})
    .then(foundedUser => {
        if(foundedUser!== null) {
            res.render('signup', {message: "Username is taken..."});
            return;
        }
        else {
            // hashing password ==> adding salt, then encripting it
            const salt = bcrypt.genSaltSync()
            const hashedPassword = bcrypt.hashSync(password, salt)
            User.create({ username, password: hashedPassword })
            .then(foundedUser => {
                console.log(foundedUser)
                res.redirect('/auth/login')
            })
            .catch(err => {
                next(err)
            })
        }
    })
})

router.get('/login', (req, res, next) => {
    res.render('login');
})

router.post('/login', (req, res, next) => {
    const {username, password} = req.body;
    console.log('SESSION =====> ', req.session);
    User.findOne({ username })
    .then(foundedUser => {
        if (!foundedUser) {
            res.render('login', { message: "OOPS, your name is wrong! Try again!" });
            return;
        }
        else if (bcrypt.compareSync(password, foundedUser.password)) {
            req.session.currentUser = foundedUser;
            res.redirect('/auth/profile');
            //console.log(`HEY: ${req.session.currentUser}`)
        } 
        else {
            res.render('login', { message:  "OOPS, wrong password! Try again!"})
            return;
        }
    })
    .catch(err => next(err))
})

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { foundedUser: req.session.currentUser });
});

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
});

module.exports = router;