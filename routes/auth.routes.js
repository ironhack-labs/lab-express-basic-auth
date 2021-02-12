const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRound = 10

const User = require('../models/User.model.js')

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', async (req, res, next) => {
    const {username, email, passwordHash} = req.body
    const saltGen = await bcrypt.genSalt(saltRound)
    const passHashed = await bcrypt.hash(passwordHash, saltGen)
    await User.create({ username, email, passwordHash: passHashed })
    res.redirect('/user-profile')
})


router.get('/signin', (req, res, next) => {
    res.render('auth/signin')
})

router.post('/signup', (req, res) => {
    const {name, email, password} = req.body
    res.render('auth/signin')
})


router.get('/user-profile', (req, res, next) => {
    res.render('user-profile')
})

router.get('/login', (req,res)=>{
  res.render('auth/login')
})


router.post('/login', (req, res,next)=>{
  const {username , password} = req.body
  if(!username || !password){
    res.render('auth/login', {username,
      errorMessage: 'Please enter both, username and password to login.',
    });
    return;
  }

  User.findOne({ username })
  .then((user) => {
    if (!user) {
      res.render('auth/login', { errorMessage: 'username does not exist.' });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('main')
    } else {
      res.render('auth/login', {username, errorMessage: 'Incorrect password.' });
    }
  })
  .catch((error) => next(error));
});

router.get('/main', (req,res)=>{
  console.log(req.session)
  res.render('users/user-main', { userInSession: req.session.currentUser })
})

router.get('/private', (req,res)=>{
  console.log(req.session)
  res.render('users/user-private', { userInSession: req.session.currentUser })
})

router.post('/logout',(req,res,next)=>{
  req.session.destroy();
  res.redirect('/');
})

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

module.exports = router