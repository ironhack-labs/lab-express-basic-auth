const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req,res,next) => {
  const user = req.session.user
  res.render("profile", {user})
  
  })

  router.get("/main", isLoggedIn, (req,res,next) => {
    const user = req.session.user
    res.render("main", {user})
    
    })

    router.get("/private", isLoggedIn, (req,res,next) => {
      const user = req.session.user
      res.render("private", {user})
      
      })
  

module.exports = router;