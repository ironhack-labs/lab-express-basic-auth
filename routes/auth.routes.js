const { Router } = require('express').Router();
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 11
const mongoose = require('mongoose')
const { isLoggedIn, isLoggedOut} = require('../middleware/route-guard.js');
const { route } = require('./index.routes');
const router = require('./index.routes');

router.get('singup', isLoggedOut, (req, res) =>{
    data = {userInSession:req.session.currentUser}
    res.render('auth/signup', data)
})

router.post('/signup', (req, res, next) =>{
    const { email, password } = req.body
    if (!email || !password) {
        res.render('aut/signup', {errorMessage: "Rescatin fill in mandatory fields."})
    return
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!regex.test(password)){
        res.render('auth/signup', {errorMessage: "Use your brain, you need 6 characters long, and some special characters"})
        return
    }

    bcrypt
        .genSalt(saltRounds)
        .then((salt) =>{
            return bcrypt.hash(password, salt)
        })
        .then(hashedPassword => {
            return User.create({
                email: email,
                passwordhash: hashedPassword
            })
        })
        .then(() =>{
            res.redirect('/profile')
        })
        .catch(error =>{
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', {errorMessage: error.message});

            }
            else if(error.code === 11000) {
                res.render('auth/signup', {errorMessage: "We have this email already"})

            }
            else {
                next(error);
            }
        })
})

router.get('/login', isLoggedOut, (req, res) =>{
    res.render('user/user-profile', req.session.currentUser)

})

router.post('/login', (req,res) =>{
    const {email, password} = req.body
    if(!email || !password) {
        res.render('auth/login', {errorMessage: "please enter and email or password"})
        return
    }
    User.findOne({email})
    .then(user =>{
        if(!user) {
            res.render('auth/login', {errorMessage: "You dont exist"})

        }
        else if(bcrypt.compareSync(password, user.passwordhash)){
            req.session.currentUser = user
            res.redirect('/profile')
        }
        else {
            res.render('auth/login', {errorMessage:"Incorrect Password"})
        }
    })
    .catch(error =>{
        console.log(error)
    })
})
router.get('/about-me', (req,res) =>{
    res.render('user/about-me', {userInSession:req.session.currentUser})

})
router.post('return-me', (req,res) =>{
    res.json({"name":"El mas turro"})
})
router.post('/logout', (req, res, next) =>{
    req.session.destroy(err => {
        if(err)next (err);
        res.redirect('/login');
    })
})

module.exports = router