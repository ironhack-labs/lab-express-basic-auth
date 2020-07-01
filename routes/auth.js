const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', (req, res, next) =>{ 
    req.session.destroy
    
    return res.redirect('/login')
    
});

router.post('/signup', (req, res, next) => {
    const{ username, password } = req.body;
    
    if (password.length < 6) {
        res.render('signup', { message: 'Your password is too short! Minimum 6 characters for your ultimate security'});
        return; 
    }
    if (username === '') {
        res.render('signup', {message: 'Your username cannot be empty sorry bro'});
        return;
    }
    // check database for user
    User.findOne({ username: username }).then(found => {
        if (found !== null) {
            res.render('signup', {message: 'username not available'});
        } else {
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt)
            User.create({username: username, password: hash})
            .then(dbUser => {
                req.session.user = dbUser;
                res.redirect('/profile')
            })
            .catch(err => {
                next(err);
            })
        }
    })
})


router.post('/login', (req, res, next) => {
    const{ username, password } = req.body;
    
    // check database for user
    User.findOne({ username: username }).then(user => {
        if (user === null) {
            return res.render('login', {message: 'user / or password wrong'});
        } 
        if (bcrypt.compareSync(password, user.password)) {
                console.log(user)
                req.session.user = user;
                res.redirect('/profile')           
        }
    })
})

module.exports = router;