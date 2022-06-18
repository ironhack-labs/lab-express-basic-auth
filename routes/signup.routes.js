const router = require('express').Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');


router.get('/signup',(req, res, next) => res.render('auth/signup'))

router.post('/signup',(req, res, next) => {
  const {role, ...restUser} = req.body
  const salt = bcryptjs.genSaltSync(10)
  const newPassword = bcryptjs.hashSync(restUser.password, salt)

  User.create({...restUser, password:newPassword})
  .then(user => res.redirect(`/auth/profile/${user._id}`)) 
  .catch(error => {
    console.log('error',error)
    next()
  })
})

router.get('/profile/:id',(req, res, next) => {
  const {id} = req.params
  User.findById(id)
  .then(user => res.render('user/profile',user))
  .catch(error => {
    console.log('error',error)
    next()
  })
})

router.get('/login',(req, res, next) => res.render('auth/login'))

router.post('/login',(req, res, next) =>{
  const {username, password} = req.body

  User.findOne({username})
    .then(user => {
      if(!user){res.render('The username or password is incorrect')}

      if(bcryptjs.compareSync(password, user.password)){
        res.redirect(`/auth/profile/${user._id}`)
      } else {
        res.send('The username or password is incorrect')
      }
    })
    .catch(error => {
      console.log('error',error)
      next()
    })
})

module.exports = router;
