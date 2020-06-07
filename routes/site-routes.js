const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next(); 
  } else {                        
    res.redirect("/login");         
  }                                 
});                                
router.get("/secret", (req, res, next) => {
  res.render("secret");
});


router.get("/home", (req, res, next) => {
  res.render("auth/home");
});


router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next(); 
  } else {                        
    res.redirect("/login");         
  }                                 
}); 

router.get("/private", (req, res) => {
  res.render("auth/private");
});

module.exports = router;
