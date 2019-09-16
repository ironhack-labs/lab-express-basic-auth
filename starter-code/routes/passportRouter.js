const router = require('express').Router()
const User = require('../models/user')
const passport = require('../handlers/passport')
const ensureLogin = require('connect-ensure-login')


router.get('/signup', (req, res, next) => {
  const config = {
    title: 'Sign Up',
    action: '/signup',
    button: 'Sign Up',
    register: true  
  }
  res.render('passport/signup', config)
})

router.post('/signup', async (req, res, next) => {
  console.log(req.body)
  try {
    const user = await User.register({ ...req.body }, req.body.password)
    console.log(user)
    res.redirect('/login')
  }
  catch (err) {
    console.log(err)
    res.send('User already exists')
  }
})

router.get('/login', (req, res, next) => {
  const config = {
    title: 'Login',
    action: '/login',
    button: 'Log In',
    register: false,
  }
  res.render('passport/login', config)
})

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/private-page',
    failureRedirect: '/login'
  }));


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/login')
})

module.exports = router