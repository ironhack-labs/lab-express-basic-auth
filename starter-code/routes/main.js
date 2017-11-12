const express = require("express");
const routes =  express.Router();

routes.get('/',(req, res, next) => {
  res.render("home");
});

routes.get('/main', (req, res, next) => {
  res.render('main');
});

routes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});


routes.get('/private', (req, res, next) => {
  res.render('private');
});


module.exports = routes;
