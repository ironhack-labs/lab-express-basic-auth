const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');

const UserModel = require('../models/User.model')


router.get('/signup', (req, res) => {
    res.render('auth/signup.hbs')
})


router.post('/signup', (req, res) => {
    // destructure the req.body
    const {username, password} = req.body
    console.log(req.body)
  
    // add validation of data, error message if field incomplete
    if(!username || !password){
      //error status 500
      res.status(500).render('auth/signup.hbs', {errorMessage: 'Please enter all details'})
      //return keyword will stop processing further lines
      return;
    }
    
    //validate the username
    const usernameReg = new RegExp(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/)
    if (!usernameReg.test(username)){
      res.status(500).render('auth/signin.hbs', {errorMessage: 'Please enter valid username'})
      return;
    }
     
    //validate the password
    const passReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)
    if (!passReg.test(password)){
      res.status(500).render('auth/signup.hbs', {errorMessage: 'Password must be 6 characters and must have a nu ber and a string'})
      return;
    }
  
  
    bcryptjs.genSalt(10)
    .then((salt) => {
        bcryptjs.hash(password , salt)
          .then((hashPass) => {
              console.log(hashPass)
              // create that user in the db
              //can write only username, email (without double)
              UserModel.create({username, passwordHash: hashPass })
                .then(() => {
                    res.redirect('/')
                })
          })
    })
  
})
  

router.get('/signin', (req, res) => {
    res.render('auth/signin.hbs')
})


router.post('/signin', (req, res) => {
    const {username, password} = req.body
    console.log(req.body)
  
    if( !username || !password){
        res.status(500).render('auth/signin.hbs', {errorMessage: 'Please enter all details'})
        return;
    }
  
    const usernameReg = new RegExp(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/)
    if (!usernameReg.test(username)){
    res.status(500).render('auth/signin.hbs', {errorMessage: 'Please enter valid username'})
    return;
    }
  
    const passReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)
    if (!passReg.test(password)){
      res.status(500).render('auth/signin.hbs', {errorMessage: 'Password must be 6 characters and must have a nu ber and a string'})
      return;
    }
  
    UserModel.findOne({username: username})
      .then((userData) => {
  
        let doesItMatch = bcryptjs.compareSync(password, userData.passwordHash); 
        if (doesItMatch){
          req.session.loggedInUser = userData
          res.redirect('/main')      
        }
        else {
          res.status(500).render('auth/signin.hbs', {errorMessage: 'Passwords do not match'})
        }
      })
      .catch((err) => {
          console.log('Error ', err)
      })
  })
  
  
  router.get('/main', (req, res) => {
    if (req.session.loggedInUser){
      res.render('users/main.hbs', {loggedInUser: req.session.loggedInUser})
    }
    else {
      res.redirect('/signin')
    }
   
  })
  
  
  router.get('/private', (req, res) => {
    if (req.session.loggedInUser){
      res.render('users/private.hbs', {loggedInUser: req.session.loggedInUser})
    }
    else {
      res.redirect('/signin')
    }
   
  })

  






  module.exports = router;
