const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require("bcryptjs")

router.get('/signup', (req, res, next) => {
  res.render('signup')
})
router.get('/login', (req, res, next) => {
  res.render('login')
})
router.get('/profile', (req, res, next) => {
  // Check if user is logged in (i.e., if user data is stored in session)
  if (req.session.user) {
    // User is logged in => Render profile page and pass user data to template
    res.render('profile', { user: req.session.user })
  } else {
    // User is not logged in => Redirect to login page
    res.redirect('/login')
  }
})

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body

  if (username === '') {
    res.render('signup', { message: 'Username cannot be empty 🙄' })
    return
  }

  if (password.length < 8) {
    res.render('signup', { message: 'Password has to be minimum 8 characters' })
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

router.post('/login', (req, res, next) => {
  const {username, password} = req.body
  
  if(username === ''){
    res.render('login', { message: 'You forgot to enter your username. 🙄 Are you stupid?!'})
    return
  }
  if(password === ''){
    res.render('login', { message: 'You forgot to enter your password. 🙄 Are you stupid?!'})
    return
  }

  User.findOne({username: username})
    .then(userFromDB => {
      if(userFromDB === null){
        res.render('login', { message: `Didn't work. There is no User called ${username}. You are stupid! 🙄`})
        return
      }
      //else (user found in db)
      if (bcrypt.compareSync(password, userFromDB.password)) {
        // Password is correct => Login user
        // req.session is an object provided by "express-session"
        console.log('Request Session User: ', req.session.user)
        req.session.user = userFromDB
        res.redirect("/profile")
      } else {
        res.render("login", { message: "Wrong credentials 🙄" })
        return
      }
    })
    .catch(err => next(err))
})
router.post('/logout', (req, res, next) => {
  req.session.destroy()
  res.redirect("/")
})
module.exports = router