const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10

router.get('/signup', (req,res) => res.render('auth/signup'))
router.post('/signup', (req,res,next) => {

  const{username, password} = req.body
  if(!username || !password){
    res.render('auth/signup', {errorMessage: 'All fields are required. Please provide a valid username and password'})
    return
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log('password hash', hashedPassword)
      return User.create({
        username,
        passwordHash : hashedPassword
      })
    })
    .then(userFromDB => {
      console.log('Newly created user is:', userFromDB);
      res.redirect('/userProfile')
    })
    .catch(e => next(e))
})
// Another way to do the this is
// router.route('/signup')
//   .get((req,res) => res.render('auth/signup')
//   .post((req,res) => {
//     console.log('The form data', req.body);)
//   })

router.get('/userProfile',(req,res) => res.render('users/user-profile'))



module.exports = router