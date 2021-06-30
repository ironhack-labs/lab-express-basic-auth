const express = require("express");
const app = require("../app");
const router = express.Router();
const User = require("../models/User.model");

function requireLogin (req, res, next) {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect('/login')
    }
  };

  router.get("/main", requireLogin, (req, res, next) =>{
    res.render("protected/main");
  });


  router.get("/private", requireLogin, (req, res, next) =>{
  res.render("protected/private");
});


  module.exports = router;