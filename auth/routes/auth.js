const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

const saltRounds = 7

router.get('/', (req,res,nxt) => {
  res.render('auth/home')
})

router.get('/signup', (req,res,nxt) => {
  res.render('auth/signup')
})

router.post('/signup', (req,res,next) => {
  const {username, password} = req.body
  if(username === '' || password === '') return res.render('auth/signup', {
    message: 'Please fill the fields'
  })
  User.findOne({username})
  .then( response => {
    if(response === null){
    const salt = bcrypt.genSaltSync(saltRounds)
    const passwordEnc = bcrypt.hashSync(password, salt)
    User.create({username, password:passwordEnc})
    .then( user => {  
      res.render('auth/home', user)
    })
    .catch( err => {
      console.log(err)
      next(err)
    })
  }
  })
  .catch( err => {
    next(err)
  })
  
})

router.get('/login', (req,res,next) => {
  //if (req.session.currentUser) return res.redirect('/profile');
   res.render('auth/login')
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
  .then(user => {
    if (user === null) {
      return res.render('auth/login', {
        message: 'This username doesnt exist, please sign up first'
      })
    }
    if (bcrypt.compareSync(password, user.password)) {
      res.redirect('/main');
    } else {
      return res.send('No eres tu :(')
    }
  })
  .catch(err => {
    console.log(err);
  })
})

router.get('/main', (req,res,next) => {
  res.render('../main')
})

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) res.send(err);
    else return res.redirect('/auth/login');
  })
})

module.exports = router