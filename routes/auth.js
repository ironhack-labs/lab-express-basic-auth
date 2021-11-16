const router = require('express').Router()

const User = require('../models/User')

router.get('/signup', async (req, res, next) => {
  try {
    res.render('signup')
  } catch (error) {
    next(new Error(error.message))
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (password.length < 10) {
      res.render('signup')
      return next(new Error('Your password is too short.'))
    }
    if (username.length === 0) {
      res.render('signup')
      return next(new Error('Your username is missing.'))
    }

    const exists = await User.findOne({
      username: username
    })

    if (exists) {
      res.render('signup')
      return next(new Error(`Username ${username} already exists.`))
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    User.create({
      username,
      password: hashedPassword
    })

    res.redirect('/login')

  } catch (error) {
    next(new Error(error.message))
  }
  
})

module.exports = router