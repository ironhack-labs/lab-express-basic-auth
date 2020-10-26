const express = require('express');
 const router = express.Router();
 const bcrypt = require('bcryptjs')
 const User = require('../models/User.model')

 /* GET home page */
 router.get('/', (req, res, next) => res.render('index'));

 router.get('/signup', (req, res) => {
     res.render('auth/signup.hbs')
 })

 router.post('/signup', (req, res)=> {
     const {email, password} = req.body
     if (!email.length | !password.length) {
         res.status(500).render('auth/signup', {message:'´Make sure no field are blank'})
         return
     }
     bcrypt.genSalt(10)
    .then((salt)=>{
     console.log(salt)
    bcrypt.hash(password, salt)
    .then((hashedPassword)=>{
     User.create({email: email, password: hashedPassword})
     .then(()=>{
    res.redirect('/signin')
    })
     .catch(()=>{
     res.status(500).render('auth/signup', {message:'email already in use'})
     })
     })
     })
 })



 /*LOG IN */
 router.get('/signin', (req, res) =>{
     res.render('auth/signin.hbs')
 })

router.post('/signin', (req,res) =>{
const {email, password} = req.body

User.findOne({email: email})
.then((userData) =>{
bcrypt.compare(password, userData.password)
.then((result)=>{
    if (result) {
        req.session.loggedInUser = userData
        res.redirect('/secret-page')
    } else {
        res.status(500).render('auth/signin.hbs', {message : 'Incorrect password'})
        }
  })
  })
.catch(()=>{
    res.status(500).render('auth/signin.hbs', {message : 'The email does not exist'})
})
})



 router.get('/secret-page', (req,res)=>{
     if (!req.session.loggedInUser) {
         res.render('index.hbs', {message: 'you are not logged in'})
         return;
     } else {
         res.render('secret-page', {name: req.session.loggedInUser.email})
         return;
     }
 })

 router.get('/main', (req, res)=>{
     if (!req.session.loggedInUser) {
         res.render('index.hbs', {message: 'you are not logged in'})
         return;
     } else {
         res.render('main', {name: req.session.loggedInUser.email})
         return;
     }
 })



 router.get('/private', (req, res)=>{
     if (!req.session.loggedInUser) {
         res.render('index.hbs', {message: 'you are not logged in'})
         return;
     } else {
         res.render('private', {name: req.session.loggedInUser.email})
         return;
     }
 })


 router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      res.redirect('/signin')
    })
  })

 module.exports = router;
