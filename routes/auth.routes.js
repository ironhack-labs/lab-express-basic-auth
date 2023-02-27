const { Router } = require('express')
const router = new Router()

const bcryptjs = require('bcryptjs')
const saltRounds = 10

const User = require('../models/User.model')
const mongoose = require('mongoose')

router.get('/signup', (req, res) => res.render('auth/signup'))



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

router.get('/userProfile', (req, res) => res.render('auth/user-profile'))

module.exports = router