const express = require('express');
const router = express.Router();


// MIDDLEWARE CHECKS IF USER IS LOGGED IN
const loginCheck = () => {
    return (req, res, next) => {
      
      if (req.session.user) {
        next();
      } else {
        res.redirect('/login')
      }
    }
  }


// GET HOME PAGE
router.get('/', (req, res, next) => res.render('index'));


// DISPLAY PROFILE PAGE IF USER IS LOGGED IN
router.get('/profile', loginCheck(), (req, res, next) => {
    console.log('this is the cookie: ', req.cookies);
    console.log('this is the logged in user: ', req.session.user);
    res.render('profile');
  })


module.exports = router;
