const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("home");
});

router.use((req, res, next) => {
    if (req.session.currentUser) { 
      next(); 
    } else {                          
      res.redirect("/login");         
    }                                
  });                             

  router.get("/main", (req, res, next) => {
    res.render("protected/main");
  });

  router.get("/private", (req, res, next) => {
    res.render("protected/private");
  });

  router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {

      res.redirect("/signup");
    });
  });

module.exports = router; 