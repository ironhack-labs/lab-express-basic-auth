const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/User')
/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  let { username, password } = req.body
  const salt = 10
  const beSalt = bcrypt.genSaltSync(salt)
  password=bcrypt.hashSync(password, beSalt)
  User.create({username, password})
  .then(()=>
  res.redirect('login')
  )
  .catch(err=>{
    console.log('este es el error', err)
    res.render('signup',{error:'inserta datos'})
  })
});
router.get('/login', (req, res, next) => {
  res.render('login');
});
router.post('/login', (req, res, next) => {
  let { username, password} = req.body
  User.findOne({username})
  .then(user=>{
    if(!user){
      res.render('login', {
        error: 'no se encontro usuario'
      })
    return
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if(!passwordIsValid){
      res.render('login', {
        error: 'contraseña incorrecta'
      })
    return
    }
    req.session.currentUser=user
    res.redirect('/private')
  }

  )
  .catch(err=>{
    console.log('este es el error', err)
    res.render('login')
  })
});




module.exports = router;