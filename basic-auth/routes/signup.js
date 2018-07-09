const express = require('express')
const bcrypt = require('bcrypt');
const router  = express.Router()
const bcryptSalt = 10;

const User = require('../models/User.js')

//Accesing the signup route
router.get('/', (req, res, next) => {
  res.render('signup/signup', {title: 'Signup'})
})


//Posting the user info
router.post('/', (req, res, next) => {
  const {username, password} = req.body
if(username ===''|| password ===''){
    res.render('signup/signup', {errorMessage: "Both, username and password must be filled"})
} else {
  User.findOne({username})
  .then(user => {
    //The username is alredy taken
    if (user !== null) throw new Error('User already exists in the database')

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    const newUser = new User({
      username,
      password: hashPass
    })

    return newUser.save()
  })
  .then(() => res.redirect('/'))
  .catch(err => {
    res.render('signup/signup', {errorMessage: err.message})
  })
}
})



module.exports = router
