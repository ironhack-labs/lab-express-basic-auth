const router = require('express').Router()
const bcrypt = require('bcryptjs')
const colors = require('colors')

const User = require('../models/User')

router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.get('/login', (req, res, next) => {
  res.render('login')
})

// middleware to protect a route
const loginCheck = () => {
  return (req, res, next) => {
    // check for a logged in user
    if (req.session.user) {
      next()
    } else {
      res.redirect('/login')
    }
  }
}

router.get('/profile', loginCheck(), async (req, res, next) => {
  // set a cookie if you want
  //res.cookie('theCookie', 'hello node')
  //(console.log('this is the cookie', req.cookies))
  // clear the cookie
  //res.clearCookie('theCookie')
  // retrieve logged in user from session
  const loggedInUser = req.session.user
  console.log('LOGGEDINUSER', loggedInUser)
  res.render('profile', { user: loggedInUser })
})

router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (password.length < 10) {
      res.render('signup', { message: 'Your password is too short' })
      return
    }
    if (username.length === 0) {
      res.render('signup', { message: 'No username'})
      return
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

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  const user = await User.findOne({ username: username })

  if (!user) {
    res.render('/login')
    return next(new Error('Invalid credentials'))
  }

  if (bcrypt.compareSync(password, user.password)) {
    req.session.user = user
    res.redirect('/profile')
  } else {
    res.render('login', { message: 'Invalide credentials' })
  }
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err)
    } else {
      res.redirect('/')
    }
  })
}) 

module.exports = router