const router = require('express').Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');


router.get('/signup',(req, res, next) => {
  if(req.session.currentUser){
    return res.redirect('/auth/profile')
  }
  res.render('auth/signup')
})

router.post('/signup',(req, res, next) => {
  const {role, ...restUser} = req.body
  const salt = bcryptjs.genSaltSync(10)
  const newPassword = bcryptjs.hashSync(restUser.password, salt)

  User.create({...restUser, password:newPassword})
  .then(user => {
    req.session.currentUser = user;
    res.redirect('/auth/profile')
  }) 
  .catch(error => {
    console.log('error',error)
    next()
  })
})

router.get('/login',(req, res, next) => {
  if(req.session.currentUser){
    return res.redirect('/auth/profile')
  }
  res.render('auth/login')
})



router.post('/login',(req, res, next) =>{
  const {username, password} = req.body

  User.findOne({username})
    .then(user => {
      if(!user){res.render('The username or password is incorrect')}

      if(bcryptjs.compareSync(password, user.password)){
        req.session.currentUser = user;
        res.redirect('/auth/profile')
      } else {
        res.send('The username or password is incorrect')
      }
    })
    .catch(error => {
      console.log('error',error)
      next()
    })
})

router.get('/profile',(req, res, next) => {
  // * SEGUNDA PARTE 
  if(!req.session.currentUser){
    return res.redirect('/auth/login')
  }

  res.render('user/profile', req.session.currentUser)
})

router.get('/logout',(req,res, next) =>{
  req.session.destroy((err) =>{
    if(err){
      next(err)
    }
    res.redirect('/auth/login')
  })
})

module.exports = router;
