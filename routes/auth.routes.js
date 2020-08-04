const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const UserModel = require('../models/User.model');
// const { get } = require('mongoose')

//Get routes

router.get('/signup', (req, res) => res.render('auth/signup'));
router.get('/signin', (req, res) => res.render('auth/signin'));

//Post routes

router.post('/signup', (req, res) => {
  const {name, password} = req.body;
  console.log ('Problem is not the route')

  if (!name || !password){
    res.status(500).render('auth/signup.hbs', {errorMessage: 'You need to fill all fields.'});
    return;
  }

  const passwordreg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/);
  if (!passwordreg.test(password)){
    res.status(500).render('auth/signup.hbs', {errorMessage: 'Password needs to be at least six characters long and contain both letters and numbers.'});
    return;
  }

  bcryptjs.genSalt(10)
    .then((salt)=>{
      bcryptjs.hash(password, salt)
        .then((hashPass)=>{
          UserModel.create({name, passwordHash: hashPass})
            .then(()=>{res.redirect('/');
            })
        })
    })
});

router.post('/signin', (req, res) => {
  const {name, password} = req.body;

  if (!name || !password){
    res.status(500).render('auth/signup.hbs', {errorMessage: 'You need to fill all fields.'});
    return;
  }

  const passwordreg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/);
  if (!passwordreg.test(password)){
    res.status(500).render('auth/signup.hbs', {errorMessage: 'Password needs to be at least six characters long and contain both letters and numbers.'});
    return;
  }
 
  UserModel.findOne({name: name})
    .then((user)=>{
      const match = bcryptjs.compare(password, user.passwordHash)
      if (match){
        req.session.loggedInUser = user;
        res.redirect('/profile')
      }
      else{
        res.status(500).render('auth/signin.hbs', {errorMessage: 'Password does not match.'});
      }
      })
    .catch((err)=>console.log('Error is: ', err))

})

router.post('/logout', (req, res) =>{
  // res.redirect('/')
  req.session.destroy(req.session.loggedInUser)
  console.log ('I AM THE SESSION')
  res.redirect('/')
})

// router.get('/profile', (req, res) =>{res.render('users/profile.hbs', {user: req.session.loggedInUser})});



module.exports = router;
