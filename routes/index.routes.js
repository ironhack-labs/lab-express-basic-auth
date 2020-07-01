const express = require('express');
const app=require('../app')
const router = express.Router();
const User=require('../models/User.model'); 
const bcrypt=require('bcrypt');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

// show login page
router.get('/login', (req, res) => {
    res.render('login')
}); 
// show signup page
router.get('/signup', (req, res) => {
    res.render('signup')
}); 

// middleware to check if user is logged in 
const loginCheck=()=> {
    return (req, res, next) => {
        if (req.session.user) {
            next(); 
        } else {
            res.redirect('/login'); 
        }
    }
}; 

router.get('/private', loginCheck(), (req, res) => {
    console.log('this is a cookie:', req.cookies); 
    console.log('this is the user:', req.session.user); 
    res.render('private'); 
}); 

// what happens when signing up
router.post('/signup', (req, res) => {
    const {username, password} = req.body; 
    if (password < 3) {
        res.render('signup', {message: 'Your password should contain at least 3 characters.'}); 
        return; 
    } if (username==='') {
        res.render('signup', {message: 'Please provide a username.'});
        return; 
    }
    // check if user is already in the database
    User.findOne({username: username})
    .then(found => {
        if (found !== null) {
            res.render('signup', {message: 'This name is already taken.'});
        } else {
            // otherwise create the user
            const salt =bcrypt.genSaltSync(); 
            const hash=bcrypt.hashSync(password, salt)
            User.create({username: username, password: hash})
            .then(dbUser => {
                req.session.user=dbUser; 
                res.redirect('/private')
            })
            .catch(err => {
            next(err); 
            })
        }
    })
}); 


router.post('/login', (req, res) => {
    const {username, password} = req.body; 
    if (password.length < 3) {
        res.render('login', {message: 'This is not a valid password.'}); 
        return; 
    } if (username ==="") {
        res.render('login', {message: 'Please enter your username.'}); 
        return; 
    } 
    User.findOne({username: username})
    .then(dbUser => {
        if (dbUser===null) {
            res.render('login', {message: 'Invalid credentials.'}); 
            return; 
        }
        if (bcrypt.compareSync(password, dbUser.password)) {
            req.session.user=dbUser; 
            res.redirect('/private'); 
        } else  {
            res.render('login', {message: 'Invalid credentials.'})
        }
    })
}); 

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err); 
        } else {
            res.redirect('/'); 
        }
    })
}); 


module.exports = router;
