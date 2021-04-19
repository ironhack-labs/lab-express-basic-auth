const express= require('express');
const User =  require('../models/User.model')
const bcrypt = require('bcryptjs');
const router= express.Router();
const saltRound = 10;

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.post('/signup', (req , res , next) => {
  const { username, password } = req.body;

    if(!username || !password){
  res.render('signup', { errorMessage: 'Username and password are required'});
}

User.findOne({username})
.then(user =>{
  if(user){
    res.render('signup', {errorMessage: "User already exists"});
  }

  const salt = bcrypt.genSaltSync(saltRound);
  const hashPassword = bcrypt.hashSync(password, salt);

  User.create ({username, password: hashPassword})
  .then (() =>{
    res.render('index');
  })
  .catch((error)=> next (error))

})
})


router.get('/login', (req, res) =>{

  if(req.session.currentUser){
    res.redirect('/')
  }else {
    res.render('login');
  }
})

router.post('/login', (req,res) =>{
  const {username, password} =  req.body;

  if(!username || !password){
    res.render('login', { errorMessage: 'Username and password are required'});
}
  User.findOne({username})
  .then(user =>{
    if(!user){
      res.render('login', {errorMessage: 'User does not exists'});
    }

    const passwordCorrect = bcrypt.compareSync(password, user.password);
    if(passwordCorrect){
      req.session.currentUser = user;
      res.redirect('/private/profile')

    }else {
      res.render('login', {errorMessage:'Incorrect username or password'})
    }
  })
})

router.get('/logout',(req, res)=>{
  req.session.destroy(err=>{
    if(err){
      res.redicrect('/');
    } else{
      res.redirect('/auth/login');
    }
  })
})

module.exports = router;

