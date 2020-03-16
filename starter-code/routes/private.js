const express = require("express");
const router = express.Router();

// PRIVATE

router.get("/", (req, res, next) => {
  res.render("index");
});



router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next(); 
  } else {                          
    res.redirect("/login");        
  }                                
});


router.get("/private", (req, res, next) => {
  const {username} = req.session.currentUser
  res.render("private", {username});
});


///////////////////////////////

// MAIN

router.get("/", (req, res, next) => {
    res.render("index");
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
  


module.exports = router;