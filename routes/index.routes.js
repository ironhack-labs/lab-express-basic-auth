const express = require('express');
const app = require('../app')
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

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
  
  router.get('/profile', loginCheck(), (req, res) => {
    res.render('userProfile');
  })

module.exports = router;
