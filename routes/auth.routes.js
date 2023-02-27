const { Router } = require('express')
const router = new Router()

const bcryptjs = require('bcryptjs')
const saltRounds = 10

const User = require('../models/User.model')
const mongoose = require('mongoose')

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js")

router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'))

// Sign up routes

router.post('/signup',(req, res, next) => {
     const { username, email, password } = req.body
     if (!username || !email || !password) {
      res.render('auth/signup', {errorMessage: 'All fields are mandatory. Please provide name, email and password.'})
     return
     }
     const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
     if (!regex.test(password)) {
      res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to be stronger!'})
      return
     }

     bcryptjs
     .genSalt(saltRounds)
     .then((salt) => bcryptjs.hash(password, salt))
     .then((hashedPassword )=> {
        return User.create({
            username,  
            email,
            passwordHash: hashedPassword
        })
     })
     .then((userFromDB) => {
        console.log('New user created: ', userFromDB)
        res.redirect('/userProfile')
     })
     .catch(error => {
      if (error instanceof mongoose.Error.ValidationError){
         res.status(500).render('auth/signup', {errorMessage: error.message})
      }else if(error.code === 11000 ) {
         res.status(500).render('auth/signup', { errorMessage: 'Username and email need to be unique!'})

      } else {
         next(error)
      }
     })
})

////////////////////////////////LOGIN////////////////////////////
// login routes

router.get('/login', (req, res, next) => res.render('auth/login'))

router.post('/login', (req, res, next) =>{
   console.log('SESSION ===> ', req.session)

   const { email, password } = req.body

   if( email === '' || password === "" ){
      res.render('/auth/login', {errorMessage: 'Please enter both, email and password to log in'})
      return
   }

   User.findOne({ email })
   .then(user => {
      if(!user){
         res.render('auth/login', {errorMessage: 'Email is not registered'})
         return
      } else if (bcryptjs.compareSync(password, user.passwordHash)){
         //res.render('auth/user-profile', {user})
         req.session.currentUser = user;
         res.redirect('/userProfile');
      } else {
         res.render('auth/login', {errorMessage: 'incorect password'})
      }
   })
   .catch(error => next(error))

 })

router.get('/userProfile',isLoggedIn, (req, res) => {
   res.render('auth/user-profile', {userInSession: req.session.currentUser})
})


//////////////////////// Log Out //////////////////////

router.post('/logout', (req,res,next) => {
   req.session.destroy(err => {
      if (err) next(err)
      res.redirect('/')
   })
})


////////////////////// Main routes ///////////////////

router.get('/main', isLoggedIn, (req, res, next) => {
   res.render('auth/main' , {userInSession: req.session.currentUser})
})

router.get('/private', isLoggedIn, (req, res, next) => {
   res.render('auth/private' , {userInSession: req.session.currentUser})
})

module.exports = router