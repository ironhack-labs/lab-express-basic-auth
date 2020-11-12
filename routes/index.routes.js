const express = require('express');
const router = express.Router();

function requiredLogin(req, res, next) {
    if (req.session.currentUser) {   
      next();
    } else {
      res.redirect('/login');
    }                     
  }

  /* GET home page */
  router.get('/', (req, res, next) => {
    req.app.locals.loggedUser = req.session.currentUser
    res.render('index', {user: req.session.currentUser});
  });

  router.get('/private', requiredLogin, (req, res) => {
    res.render('private');
  });


  router.get('/main', requiredLogin, (req, res) => {
    res.render('main');
  });

module.exports = router;
