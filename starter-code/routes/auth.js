const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

function isAutenthicated(req,res,next){
  if(req.session.currentUser){
    return next();
  } else {
    res.redirect('/login');
  }
}

function isLoggedIn (req,res,next){
  if(req.session.currentUser){
    res.redirect('/private')
  } else{
    next();
  }
}


router.get('/private', isAutenthicated, (req,res)=>{
  res.render("index")
})

router.get('/login', isLoggedIn, (req,res)=>{
  res.render('auth/login');
})

router.post('/login', (req,res,next)=>{
  User.findOne({username:req.body.username})
  .then(user=>{
    if(!user){
      req.body.error = "Este Usuario no Existe";
      return res.render('auth/login', req.body);
    }
    if (bcrypt.compareSync(req.body.password, user.password)){
      req.session.currentUser = user;
      res.redirect('/private');
    }else{
      req.body.error = "LA Contraseña no es correcta";
      return res.render('auth/login', req.body)
    }
  })
  .catch(e=>next(e))
})

router.get('/logout',(req,res)=>{
  req.session.destroy(()=>{
    res.redirect('/login');
  })
})

router.get('/signup',(req,res)=>{
  res.render('auth/signup')
})

router.post('/signup',(req,res,next)=>{
  User.findOne({username:req.body.username})
  .then(user=>{
    if(user){
      req.body.error = "Ya existe ese usuario"
      return res.render('auth/signup', req.body)
    }
    if(req.body.password !== req.body.password2){
      req.body.error = "Escribe la contraseña diferente";
      return res.render('auth/signup', req.body)
    } else {
      const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(256));
      req.body.password = hash;
      User.create(req.body)
      .then(user=>res.send(user))
      .catch(err=>console.log(err));
    }
  })
  
})

module.exports = router;