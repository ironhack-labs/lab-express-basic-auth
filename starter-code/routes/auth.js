const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const strength = require('strength');
let pwSignup = document.querySelector('input[name="password"]');

console.log(howStrong); // 0

// Session
function isAuth(req,res,next) {
  if (req.session.currentUser) {
    console.log('session 🍕')
    res.redirect('/')
  } else {
    next()
  }
}

// Private content
router.get('/main', (req, res, next) => {
  if (req.session.currentUser) {
    res.render('private/main')
  } else {
    res.redirect('/')
  }
})
router.get('/private', (req, res, next) => {
  if (req.session.currentUser) {
    res.render('private/private')
  } else {
    res.redirect('/')
  }
})

// Login

router.post('/login', (req,res,next) => {
  let {username,password} = req.body
  User.findOne({username})
  .then(user => {
    if(!user) return res.render('auth/login', {error: "Tu usuario no existe"})
    if(bcrypt.compareSync(password,user.password)) {  // looking for the hashed pw
      req.session.currentUser = user // Storing the session
      res.redirect('/')
      return
    } else {
      res.render('auth/login', {error: "Tu password es incorrecto"})
    }
  })
  .catch(e=> next(e))
})

router.get('/login', isAuth, (req, res, next) => {
  res.render('auth/login')
})

//Signup
router.post('/signup', (req, res, next) => {
  let {username} = req.body
  if(req.body.password !== req.body.password2) {
    res.render('auth/signup', {...req.body, errors:{password: "Los passwords no coinciden"}})
    return
  }
if(User.findOne({username})) return res.render('auth/signup', {...req.body, errors:{username: "Tu username ya esta en uso"}})
let salt = bcrypt.genSaltSync(10)
let hash = bcrypt.hashSync(req.body.password,salt)
req.body.password = hash
 User.create(req.body) 
 .then(() => res.redirect('/login'))
 .catch(e=> next(e))
})

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
  document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('select[name="ice-cream"]').onchange=changeEventHandler;
},false);

function changeEventHandler(event) {
    // You can use “this” to refer to the selected element.
    if(!event.target.value) alert('Please Select One');
    else alert('You like ' + event.target.value + ' ice cream.'); 
} 
  var howStrong = strength(password);
})

module.exports  = router