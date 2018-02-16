const express = require('express');

const router = express.Router();

router.get("/", function(req, res, next) {
    res.render("index");
  });

  router.get("/main", function(req, res, next) {
    if(req.session.currentUser){
      res.render("main");
  } else {
    res.redirect("users/logIn")
  }
  });
  router.get("/private", function(req, res, next) {
    if(req.session.currentUser){
      res.render("private");
  } else {
      res.redirect("users/logIn")
  }
  });
  


module.exports = router;
