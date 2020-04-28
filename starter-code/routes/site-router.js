const express = require('express');
const siteRouter = express.Router();

// Middleware function - checks if the user is authenticated
function isLoggedIn(req, res, next) {
  if (req.session.currentUser) { // If user is authenticated
    next();
  } else {
    res.redirect('/auth/login');
  }
}


// GET         '/main'       
siteRouter.get('/main', isLoggedIn, (req, res, next) => {
  res.render('auth-views/main');
})

// GET         '/pirvate'       
siteRouter.get('/private', isLoggedIn, (req, res, next) => {
  res.render('auth-views/private');
})

module.exports = siteRouter;