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
  const {username} = req.session.currentUser
  res.render("main", {username});
});

router.get("/private", (req, res, next) => {
  const {username} = req.session.currentUser
  res.render("private", {username});
});

module.exports = router;

