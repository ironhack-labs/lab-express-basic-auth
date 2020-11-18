const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/User.model");

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    //console.log('POST works')
    const {username, password} = req.body
    //console.log(username, password)
    if (password.length < 6) {
        res.render('signup', { message: 'Your password must have at least 6 chars' });
    } else if (username === '') {
        res.render('signup', { message: 'Your username cannot be empty' });
    } else {
        // check if the username already exists
        User.findOne({ username: username })
        .then( data => {
            if (data !== null) {
                res.render('/signup', { message: 'This Username is already taken' })
            }
            else {
                const salt = bcrypt.genSaltSync();
                console.log(salt);
                const hash = bcrypt.hashSync(password, salt);
                console.log(hash)
                User.create({
                    username: username, 
                    password: hash
                })
                .then(data => {
                    console.log(data)
                    req.session.user = data;
                    res.redirect('private');
                })
                .catch( err => console.log(err))
            }
        }) 
    } 
});

router.get('/login', (req, res) => {
    res.render('login')
});

router.post('/login', (req, res) => {
    console.log(req.body)
    const {username, password} = req.body
    User.findOne({ username: username })
    .then( data => {
        if (data === null) {
            res.render('/login', { message: 'This Username doesnt exist/invalid credentials' })
        }
        else if (bcrypt.compareSync(password, data.password)) {
            // password and hash match
            // login the user
            req.session.user = data;
            res.redirect('/private');
        } else {
            res.render('/login', { message: 'invalid credentials' })
        }
    })  
});

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) {
        next(err);
      } else {
        res.redirect('/')
      }
    })
});



module.exports = router;
