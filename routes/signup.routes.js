const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const saltRound = 10;
const User = require('../models/User.model');

router.get('/signup',(req, res, next) => {
  res.render('../views/signup.hbs')
})

router.post('/signup',(req, res, next) => {
  const {username , password} = req.body

  bcryptjs
    .genSalt(saltRound)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPswd => {
      return User.create({
        username,
        passwordHash: hashedPswd
      })
    })
    .then(() => {
      console.log('a new user was created')
      res.redirect('/user')
    })
    .catch(error =>{
      console.log(error)
      next()
    })
})

router.get('/user',(req, res, next) =>{
  res.render('../views/user.hbs')
})

module.exports = router