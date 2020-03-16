const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  if (req.session.currentUser) { 
    res.redirect('/main');
  } else {
    res.redirect('/login');  
  }
});

router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next(); 
  } else {                          
    res.redirect("/login");        
  }                                
});
  
router.get("/main", (req, res, next) => {
  const {username} = req.session.currentUser;
  res.render("user/main", {username});
});

router.get("/private", (req, res, next) => {
  const {username} = req.session.currentUser;
  res.render("user/private", {username});
});

module.exports = router;