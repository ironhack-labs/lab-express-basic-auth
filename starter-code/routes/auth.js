const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt')
const User = require('../models/user')


router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  bcrypt.hash(password, 10)
    .then(hash => {
      return User.create({
        username: username,
        password: hash
      })
      .then(user => {
        res.redirect('/main')
      })
    })
})

router.get('/login', (req, res, next) => {
  res.render('auth/login')
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body

  let theUser

  User.findOne({username: username})
    .then(user => {

      theUser = user
      if (!user) {
        res.send('username not found')
        throw('username not found')
      }
      return bcrypt.compare(password, user.password)
    })
    .then(passwordCorrect => {

      if(!passwordCorrect) {
        res.send('password incorrect')
        return
      }

      req.session.user = theUser
      console.log("hi")
      res.render('auth/private')

    })
    .catch(e => {
      next(e)
    })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(() =>{
    res.redirect('/auth/login')
  })
})

module.exports = router;