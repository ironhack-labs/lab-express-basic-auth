const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require('bcrypt')

// Login routes
router.get('/login', (req, res) => res.render('auth/login'))

router.post('/login', (req, res) => {
  const { username, password } = req.body

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'user not found' })
        return
      }

      if (bcrypt.compareSync(password, user.password) === false) {
        res.render('auth/login', { errorMessage: 'Wrong password' })
        return
      }
      console.log('---------------', user)
      req.session.currentUser = user
      res.redirect('/')
    })
    .catch((err) => console.log(err))
})

// SignUp routes
router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/signup', (req, res) => {
  const { username, password } = req.body

  User.find({ username }).then((user) => {
    if (user.length) {
      res.render('auth/signup', {
        errorMessage: 'This username is already in use',
      })
    } else {
      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({ username, password: hashPass })
        .then((createdUser) => {
          console.log(createdUser)
          res.redirect('/auth/login')
        })
        .catch((err) => console.log(err))
    }
  })
})

module.exports = router
