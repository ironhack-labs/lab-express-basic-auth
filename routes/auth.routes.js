const bcryptjs = require('bcryptjs')
const { Router } = require('express')
const User = require('../models/User.model')

const saltRounds = 10
const router = new Router()

//Routers

router.get('/signup', (req, res, next) => res.render('auth/signup'))

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        password: hashedPassword
      })
    })

    .catch((err) => next(err))
})

router.get('/login', (req, res) => {
  res.render('auth/login')
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body
  console.log('SESSION =====> ', req.session)
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    })
    return
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Username is not registered. Try with other username.'
        })
        return
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user
        res.redirect('/userProfile')
        res.render('users/user-profile', {
          userInSession: req.session.currentUser
        })
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' })
      }
    })
    .catch((error) => next(error))
})
module.exports = router
