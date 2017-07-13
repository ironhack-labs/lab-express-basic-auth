var express = require('express');
var routes = express.Router();

// If the user is logged in, server the page requested, else redirect to the login page
function auth(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page. */
routes.get('/',  function(req, res, next) {
  res.render('index', { title: 'Basic Auth' });
});

// GET main private page
routes.get('/main', auth, function (req, res, next) {
  res.render('auth/main');
});
 
routes.get('/private', auth, function (req, res, next) {
  res.render('auth/private');
});


module.exports = routes;