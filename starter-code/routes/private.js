const express = require("express");
const router = express.Router();
const UserModel = require("./../models/user");

router.use((req, res, next) => {
    if (req.session.currentUser) { 
      next(); 
    } else {                         
      res.redirect("/login");         
    }                                 
  }); 
  router.get("auth/private", (req, res, next) => {
    res.render("private");
  });

  module.exports = router;