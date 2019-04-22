require('dotenv').config()
const express = require('express');
const router  = express.Router();
const User = require ('../models/User')
const bcrypt = require ('bcrypt')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req,res,next)=>{
  const config ={
    action: '/signup',
    button:'signup'
  }
  res.render('auth/signup', config)
})

router.post('/signup', (req,res,next)=>{
  const salt = bcrypt.genSaltSync(Number(process.env.ROUNDS))
  User.create({
    ...req.body,
    password: bcrypt.hashSync(req.body.password, salt)
  })
  .then(user =>{
    res.send(user)
  })
  .catch(err => {
      if(String(err.errmsg).includes('E11000 duplicate key')){
        res.render('auth/signup',{err:'Ese usuario ya existe'})
      } else {
        res.send(err)
      }
    })
})

module.exports = router
