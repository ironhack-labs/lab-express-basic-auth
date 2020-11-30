const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')


router.get('/signup', (req, res) => {
    
    res.render('auth/signup.hbs')
})

router.get('/signin', (req, res) => {
  
  res.render('auth/signin.hbs')
})

router.post('/signup', (req, res) => {
    const {name, email, password} = req.body

    if (!name || !email || !password) {
      res.status(500).render('auth/signup.hbs', {message: 'Please enter all details'})
      return;
    }

    let emailReg = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    if (!emailReg.test(email)) {
      res.status(500).render('auth/signup.hbs', {message: 'Please enter valid email'})
      return;
    }
  

    let passwordReg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)
    if (!passwordReg.test(password)) {
      res.status(500).render('auth/signup.hbs', {message: 'Password must have one lowercase, one uppercase, a number, a special character and must be atleast 8 digits long'})
      return;
    }

    bcrypt.genSalt(10)
      .then((salt) => {

        bcrypt.hash(password, salt)
          .then((hashedPassword) => {

            UserModel.create({
              name,
              email, 
              password: hashedPassword
            })
              .then(() => {
                    res.redirect('/')      
              })

          })      
      })
})


router.post('/signin', (req, res) => {
  const {email, password} = req.body

  UserModel.findOne({email: email})
    .then((userData) => {
          
          if (!userData) {
            res.status(500).render('auth/signin.hbs', {message: 'User does not exist'}) 
            return;
          }

          bcrypt.compare(password, userData.password)
            .then((result) => {
                //check if result is true
                if (result) {
                    
                    req.session.loggedInUser = userData 
                    res.redirect('/dashboard')
                }
                else {
                   res.status(500).render('auth/signin.hbs', {message: 'Passwords not matching'}) 
                }
            })
            .catch(() => {
              res.status(500).render('auth/signin.hbs', {message: 'Something went wrong. Try again!'}) 
            })
    })

})

router.get('/dashboard', (req, res) => {
      
      res.render('dashboard.hbs', {name: req.session.loggedInUser.name})
})



module.exports = router;