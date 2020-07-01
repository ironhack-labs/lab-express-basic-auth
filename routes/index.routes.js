const express = require('express');
const router = express.Router();
const app = require("../app");
/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

// middleware to check if user is logged in
const loginCheck = () => {
    return (req, res, next) => {
      // is the user logged in 
      if (req.session.user) {
        next();
      } else {
        res.redirect('/login');
      }
    }
  }

 router.get('/private', loginCheck(), (req, res) => {
    console.log('this is the cookie: ', req.cookies);
    console.log('this is the user: ', req.session.user);
    res.render('private');
  })
  



module.exports = router;
