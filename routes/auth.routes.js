const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('../models/User.model')

router.get("/signup", (req, res, next) => {
    res.render("auth/signup")
  })

router.post("/signup", (req, res, next) => {
    const {email, plainPassword} = req.body

    if (email.length === 0 || plainPassword.length === 0) {
      res.render('auth/signup', { errorMessage: 'Fields are mandatory :)' })
      return
    }

    User
    .findOne({ email })
    .then(user => {
      if(user) {
        console.log("HOlAAAAAAAAAAAAAA")
        res.render('auth/signup', { errorMessage: 'There´s already a user signed up with this email'})
      } else {
        bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hash(plainPassword, salt))
      .then(hashedPassword => User.create({email, password: hashedPassword}))
      .then(res.redirect('login'))
      }
    })
    .catch(err=>(console.log(err)))
  })

  router.get("/login", (req, res, next) => {
    res.render("auth/login")
  })

  router.post("/login", (req, res,next) => {
    
    const {email, password} = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Fields are mandatory :)' })
        return
      }

    User
    .findOne({email})
    .then(foundUser => {
        if(!foundUser) {
            res.render('auth/login', {errorMessage: 'User not found'})
        }
        if (!bcrypt.compareSync(password, foundUser.password)) {
            res.render('auth/login', { errorMessage: 'Wrong password, try again' })
            return
          }
          req.session.currentUser = foundUser 
        res.redirect('/profile')
    })

  })   

  router.get('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
  })

  module.exports = router
