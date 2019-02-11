let router = require('express').Router()
let User = require('../models/User')
let bcrypt = require('bcrypt')
let strength = require('strength');


function isAuth(req,res,next) {
  if (req.session.currentUser) {
    res.redirect('/')
  } else {
    next()
  }
}


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



router.post('/login', (req,res,next) => {
  let {username,password} = req.body
  User.findOne({username})
  .then(user => {
    if(!user) {
      return res.render('auth/login', {error: "Tu usuario no existe"})
    } 
    if(bcrypt.compareSync(password,user.password)) { 
      req.session.currentUser = user
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


router.post('/signup', (req, res, next) => {
  let {username} = req.body
  if(req.body.password !== req.body.password2) {
    res.render('auth/signup', {...req.body, errors:{password: "Passwords no coinciden"}})
    return
  }
if(User.findOne({username})) {
  return res.render('auth/signup', {...req.body, errors:{username: "Alguien esta loggeado"}})
} 
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
        if(!event.target.value){
          alert('Selecciona uno');
        } 
    else {
      alert('te gusta el helado de' + event.target.value);
    }  
} 
  var howStrong = strength(password);
})

module.exports  = router 