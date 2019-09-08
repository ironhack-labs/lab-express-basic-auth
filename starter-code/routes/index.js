const express = require('express')
const router  = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/signup', (req, res, next) => {
  res.render('signup');
})

router.post('/signup', async(req, res, next) => {
  const { email, password } = req.body
  const salt = bcrypt.genSaltSync(5)
  const hashedPassword = bcrypt.hashSync(password, salt)
  const user = await User.create({email, password: hashedPassword })
  res.redirect('/login')
})

router.get('/login', (req, res, next) => {
  res.render('login');
})

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({email})
  if(!user){
    res.render('login', {err: `User doesn't exists`})
  } else {
    if (bcrypt.compareSync(password, user.password)) {

      req.session.loggedUser = user
      req.app.locals.loggedUser = user
      res.redirect('/main')
      res.send('Welcomememe!')
    } else {
      res.render('login', {err: `Your password doesn't match`})
    }
  }
})

router.get('/main', isLoggedIn, (req,res, next) => {
  const {loggedUser} = req.app.locals
  res.render('main', loggedUser)
})

router.get('/private', isLoggedIn, (req,res, next) => {
  const {loggedUser} = req.app.locals
  res.render('private', loggedUser)
})

function isLoggedIn(req,res, next) {
  if(req.session.loggedUser) {
    next()
  } else {
    res.redirect('/login')
  }
}




module.exports = router;
