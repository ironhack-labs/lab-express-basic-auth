const mongoose = require("mongoose");
const router = require("express").Router();
const encrypter = require('bcryptjs');
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


router.get('/signup', isLoggedOut, (req, res) => {
    res.render('signup')
})

router.post('/signup', isLoggedOut, (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.render('signup', { errorMessage: 'All fields are mandatory. Please choose both a username and password.' });
        return;
      }
    
    encrypter.genSalt(10)
    .then(salt => {
        return encrypter.hash(password, salt)
    })
    .then(hashedPassword => {
        return User.create({
            username: username,
            passwordHash: hashedPassword
        })
    })
    .then(newUser => {
        console.log(`New user created : ${newUser}`)
        res.redirect('/')
    }) 
    .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('signup', { errorMessage: error.message });
        } 
        else if (error.code === 11000) {
          res.status(500).render('signup', {errorMessage: 'Username already in use.'});
        }
        else {
          next(error);
        }
      })
})

router.get('/login', isLoggedOut, (req, res) => {
    console.log(req.session)
    if (req.session.currentUser) {
        res.redirect('/userprofile')
    }
    else {
        res.render('login')
    }
})

router.post('/login', isLoggedOut, (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        res.render('login', { errorMessage: 'Enter your username and password to login.' });
        return;
    }
    
    User.findOne({username})
    .then(user => {
        if (user === null) {
            res.render('login', {errorMessage : 'User not found.'})
            return
        }
        
        else if (encrypter.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user
            req.app.locals.signedInUser = req.session.currentUser
            res.redirect(`/userprofile`)
        }
        
        else {
            res.render('login', {errorMessage : 'Password incorrect.'})
        }
    })
    .catch(err => console.log(err))
})

router.get('/userprofile', isLoggedIn, (req, res) => {
    res.render('userprofile')
})

router.post('/logout', isLoggedIn, (req, res) => {
    req.session.destroy()
    req.app.locals.signedInUser = null
    res.redirect('/')
})

module.exports = router;