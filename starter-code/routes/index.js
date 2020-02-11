const express = require('express');
const router  = express.Router();
const signUpRouter = require('./sign-up');
const loginRouter = require('./log-in');



//open routes
router.use(["/sign-up", "/signup"], signUpRouter);
router.use(["/log-in", "/login"], loginRouter);

// AUTHENTICATION CHECKER
router.use((req, res, next) => {
  if (req.session.currentUser) {
    next(); 
  } 	
  else {  
    res.redirect("/login"); 
  }  
});	

//private routes
router.use("/main", (req, res, next) => {
  res.render('../views/main')
})
router.use("/private", (req, res, next) => {
  res.render('../views/private')
})

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
