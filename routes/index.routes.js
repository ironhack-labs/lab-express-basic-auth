const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const UserModel = require('../models/User.model')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', (req, res) => {
    res.render('auth/signup.hbs')
})

router.post('/signup', (req, res)=> {
    const {username, password} = req.body
    if (!username.length | !password.length) {
        res.status(500).render('auth/signup', {message:'´Make sure no field are blank'})
        return
    }
    bcrypt.genSalt(10)
        .then((salt)=>{
            console.log(salt)
            bcrypt.hash(password, salt)
                .then((hashedPassword)=>{
                    UserModel.create({username: username, password: hashedPassword})
                        .then(()=>{
                            res.redirect('/')
                        })
                        .catch(()=>{
                            res.status(500).render('auth/signup', {message:'username already in use'})
                        })
                })
        })
})

router.get('/signin', (req, res) =>{
    res.render('auth/signin.hbs')
})

router.post('/signin', (req,res) =>{
    const {username, password} = req.body

    UserModel.findOne({username: username})
        .then((userData) =>{
            bcrypt.compare(password, userData.password)
                .then((result)=>{
                    if (result) {
                        req.session.loggedInUser = userData
                        res.redirect('/dashboard')
                    } 
                    else {
                        res.status(500).render('auth/signin.hbs', {message : 'Check your password'})
                    }
                })
        })
        .catch(()=>{
            res.status(500).render('auth/signin.hbs', {message : 'Check your username'})
        })
})

router.get('/dashboard', (req,res)=>{
    if (!req.session.loggedInUser) {
        res.render('index.hbs', {message: 'you are not logged in'})
        return;
    } else {
        res.render('dashboard', {name: req.session.loggedInUser.username})
        return;
    }
})

router.get('/main', (req, res)=>{
    if (!req.session.loggedInUser) {
        res.render('index.hbs', {message: 'you are not logged in'})
        return;
    } else {
        res.render('main', {name: req.session.loggedInUser.username})
        return;
    }
})

router.get('/private', (req, res)=>{
    if (!req.session.loggedInUser) {
        res.render('index.hbs', {message: 'you are not logged in'})
        return;
    } else {
        res.render('private', {name: req.session.loggedInUser.username})
        return;
    }
})

module.exports = router;

