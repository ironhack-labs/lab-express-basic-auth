const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require("bcryptjs")

router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body

  if (username === '') {
    res.render('signup', { message: 'Username cannot be empty' })
    return
  }

  if (password.length < 8) {
    res.render('signup', { message: 'Password has to be minimum 4 characters' })
    return
  }

  User.findOne({username: username})
    .then(userFromDB => {
      if(userFromDB !== null){
        res.render('signup', { message: 'Username is already taken!'})
      }
      else{
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, salt)

        User.create({username: username, password: hash})
          .then(() => {
            res.redirect('/')
          })
          .catch(err => next(err))
      }
    })
  // User.create({username, password})
})

module.exports = router