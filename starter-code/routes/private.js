const express = require('express');
const route = express.Router();

function auth(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

route.get('/private', auth,  (req, res, next) => {
    res.render('private');
});

route.get('/main', auth, (req, res, next) => {
    res.render('main');
});

module.exports = route;