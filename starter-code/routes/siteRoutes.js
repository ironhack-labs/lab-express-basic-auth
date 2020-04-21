const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res, next) => {
  res.render('index.hbs');
});

// protected routes

router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next(); 
  } else {                      
    res.redirect("/login");     
  }                        
});                            

router.get("/private", (req, res, next) => {
  res.render("private.hbs");
});

router.get('/main', (req, res) => {
  res.render('main.hbs');
});

module.exports = router;
