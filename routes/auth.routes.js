const { Router } = require('express');
const router = new Router()
const bcrypt = require('bcryptjs')
const saltRounds = 11;
const User = require('../models/User.model')

const mongoose = require('mongoose')
const { isLoggedIn, isLoggedOut} = require('../middleware/route-guard.js');
const { route } = require('./index.routes');


router.get('/signup', isLoggedOut,(req, res) => res.render('auth/signup'))
    
router.post('/signup', isLoggedOut,(req, res, next) =>{
    const { username, password } = req.body;
    console.log(req.body)
    if (!username || !password) {
        res.render('auth/signup', {errorMessage: "Please fill in mandatory fields."})
    return;
    }
    const regex = /(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!regex.test(password)){
        res.render('auth/signup', {errorMessage: " you need 6 characters long, and some special characters"})
        return;
    }


    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
               
                
                passwordhash: hashedPassword
            });
        })
        .then((userFromDB) =>{
            req.session.currentUser = userFromDB;
            res.redirect('/')
        })
        .catch(error =>{
            console.error(error);
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', {errorMessage: error.message});

            }
       
            else {
                next(error);
            }
        })
})

router.get('/login',isLoggedOut,  (req, res) =>{
    res.render('auth/login')

})

router.post('/login',isLoggedOut, (req,res) =>{
    const {username, password} = req.body;
    console.log(req.body)
    if(!username || !password) {
        res.render('auth/login', {errorMessage: "please enter username or password"})
        return;
    }
    User.findOne({username})
    .then((user) =>{
        if(!user) {
            res.render('auth/login', {errorMessage: "You dont exist"})
            return
        }
        else if(bcrypt.compareSync(password, user.passwordhash)){
            req.session.currentUser = user
            res.redirect('/')
        }
        else {
            res.render('auth/login', {errorMessage:"Incorrect Password"})
        }
    })
    .catch(error =>{
        console.log(error)
    })
})
router.get('/main', isLoggedIn,  (req, res) =>{
    res.render('main')

})
router.get('/private',isLoggedIn,  (req, res) =>{
    res.render('private')

})


router.post('/logout',isLoggedIn, (req, res, next) =>{
    req.session.destroy(err => {
        if(err)next (err);
        res.redirect('/login');
    })
})

module.exports = router