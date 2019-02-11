const express = require('express');
const router  = express.Router();
let User = require('../models/User')
let bcrypt = require('bcrypt')


function isLogged(req,res,next){
  if(req.session.currentUser){
    res.redirect('/')
  }else{
    next()
  }
}
function isAuth(req,res,next){
  if(req.session.currentUser){
    next()
  }else{
    res.redirect('/login')
  }
}

router.get('/private', isAuth, (req, res, next) => {
  res.render('privatepages/private');
})

router.get('/main', isAuth, (req, res, next) => {
  res.render('privatepages/main');
})


router.post('/login', (req, res, next) => {
  let {username,password} = req.body
  User.findOne({username})
  .then(user=>{
    if(!user) return res.render('auth/login',{error:"Login Inválido"})
    if(bcrypt.compareSync(password,user.password)){
      req.session.currentUser = user
      return res.redirect('/')
    }
    res.render('auth/login',{error:"Contraseña Inválida"})
  })
  .catch(e=>next(e))
})

router.get('/login', isLogged, (req, res, next) => {
  res.render('auth/login');
})

router.post('/signup', (req, res, next) => {
  if(req.body.password !== req.body.password2){
    return res.render('auth/signup', {...req.body, errors:{password:"Los passwords son diferentes"}})    
  }
  let salt = bcrypt.genSaltSync(256)
  let hash = bcrypt.hashSync(req.body.password, salt)
  req.body.password = hash

  User.create(req.body)
  .then(()=>res.redirect('/login'))
  .catch(e=>next(e))
})

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

module.exports = router;