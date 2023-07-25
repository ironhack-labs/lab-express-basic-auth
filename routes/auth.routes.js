const express = require('express');
const router = express.Router();
const user = require('../models/User.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const saltRounds = 10;
const {isLoggedIn, isLoggedOut} = require('../routes/middleware/route-guard')
// const { isLoggedIn } = require('../routes/middleware/authMiddleware'); 

router.get('/signup', (req, res) => {
  res.render('signup'); 
});


router.get('/login',isLoggedOut, (req, res) => {
  console.log(req.session)
  data = {userInSession:req.session.currentUser}
  console.log(data)
  res.render('auth/login',data)
})


router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  bcrypt
  .genSalt(saltRounds)
  .then(salt => bcrypt.hash(password, salt))
  .then((hashedPassword) => {
    return user.create({ username, password: hashedPassword });
  })
  .then(() => {
    req.session.user = { username }; 
    res.redirect('/dashboard'); 
  })
  .catch((error) => {
    console.error(error);
    res.render('signup', { error: 'An error occurred during signup. Please try again.' });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  user.findOne({ username })
    .then((userFromDB) => {
      if (!userFromDB) {
      
        return res.render('auth/login', { error: 'Invalid username or password.' });
      }

  user.findOne({ username })
    .then((user) => {
      if (!user) {
     
        return res.render('auth/login', { error: 'Invalid username or password.' });
      }

     
        // const user = await user.findOne({ username });
        // if (!user) {
        //   return res.render('login', { error: 'Invalid username or password.' });
        // }
    
        bcrypt.compare(password, userFromDB.password)
          .then((isMatch) => {
            if (!isMatch) {
         
            return res.render('auth/login', { error: 'Invalid username or password.' });
          }
       
          req.session.user = { username };
          res.redirect('/userProfile');
        });
    }

   
router.get('/main', isLoggedIn, (req, res) => {

  res.render('main');
})

// Route for displaying the private page (protected)
router.get('/private', isLoggedIn, (req, res) => {
  // render with gif
  res.render('private');
})
    .catch((error) => {
      console.error(error);
      res.render('auth/login', { error: 'An error occurred during login. Please try again.' });
    })
});


 // Route to render the user profile page
router.get('/userProfile', (req, res) => {
  const { user } = req.session;
  if (!user) {
    return res.redirect('/login');
  }
  res.render('users/user-profile', { user });
});

  module.exports = router;

 
