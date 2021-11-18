const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { isLoggedOut, isLoggedIn } = require('../middleware/route-guard')

// Models
const User = require('../models/User.model')

// GET form to sign in
router.get('/signup', (req, res, next) => {
  res.render('createUser')
})

// GET log in page
router.get('/login', (req, res, next) => {
  res.render('login')
})

// POST sign in new user
router.post('/signup', isLoggedOut, async (req, res, next) => {
  const { username, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const createUser = await User.create({ username, password: hashedPassword })
    res.render('createUser', { justCreatedUser: createUser.username })
  } catch (err) {
    console.log('Error:', err)
  }
})

// POST log in
router.post('/login', isLoggedOut, async (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.render('login', { errorMsg: 'You need to fill all inputs' })
  }
  const userFromDB = await User.findOne({ username })
  if (!userFromDB) {
    res.render('login', { errorMsg: 'The user does not exist' })
  } else {
    const passwordMatch = await bcrypt.compare(password, userFromDB.password)
    if (!passwordMatch) {
      res.render('login', { errorMsg: 'Incorrect password' })
    } else {
      req.session.loggedUser = userFromDB
      console.log('SESSION =========> ', req.session)
      res.redirect('profile')
    }
  }
})

// POST logout
router.post('/logout', isLoggedIn, async (req, res, next) => {
  res.clearCookie('connect.sid', { path: '/' })
  try {
    await req.session.destroy()
    res.redirect('/')
  } catch (err) {
    next(err)
  }
})

module.exports = router
