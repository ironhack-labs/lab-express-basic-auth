const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const User = require("../models/User.model");

const {isAuthenticated, isNotAuthenticated} = require('../middleware/auth.middleware')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', (req,res,next) => {
  res.render('signup.hbs')
})

router.post('/signup', (req,res,next) => {
  let userName = req.body.username
  let passWord = req.body.password
  let myHashedPassword = bcryptjs.hashSync(passWord)
  User.create({
    username: userName,
    password: myHashedPassword
  })
  .then(data => {
    console.log('New registration data:', data)
    res.redirect('/login')
  })
  .catch(err => {
    console.log('Error during registration:', err)
    res.send('Error during registration')
  })
})

router.get('/login', isNotAuthenticated, (req,res,next) => {
  res.render('login.hbs')
})

router.post('/login', (req,res,next) => {
  let userName = req.body.username
  let passWord = req.body.password
  User.findOne({
    username: userName
  })
  .then(foundUser => {
    if(!foundUser) {
      res.send('Username or password incorrect')
      return
    }
    const isValidPassword = bcryptjs.compareSync(passWord, foundUser.password)
    if(!isValidPassword) {
      res.send('Username or password incorrect')
      return
    }
    req.session.user = foundUser
    res.redirect('/main')
    // res.render('main.hbs', {username: foundUser.username})
  })
})

router.get('/main', isAuthenticated, (req,res,next) => {
  res.render('main.hbs', {username: req.session.user.username})
})

router.get('/private', isAuthenticated, (req,res,next) => {
  res.render('private.hbs', {username: req.session.user.username})
})

module.exports = router;
