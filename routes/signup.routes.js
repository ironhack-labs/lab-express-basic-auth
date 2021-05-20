const {Router} = require('express')
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const router = new Router()

const User = require('../models/User.model.js')

const saltRounds = 10

router.get('/signup', (req, res, next) => res.render('auth/signup'))

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body

    if (!username || !password) {
        res.render('auth/signup', {
            errorMessage: 'Please fill in all fields'
        })
        return
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)
            .render('auth/signup', {errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'})
        return
    }

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        passwordHash: hashedPassword
      })
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB)
      res.redirect('/')
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message })
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username needs to be unique. Username is already used.'
        })
      } else {
        next(error);
      }
    })
})

module.exports = router