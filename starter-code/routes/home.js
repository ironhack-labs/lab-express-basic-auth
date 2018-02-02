const express = require("express");
const router = express.Router();

router.get("/", (req,res,next) => {
  console.log("HOME")
  if(req.session.currentUser){
    console.log("LOGGED")
    res.redirect("/private");
    next();
  } else{
    console.log("NOT LOGGED")
    res.redirect("/main");
  }
});

router.get("/private", (req, res,next) => {
  res.render("auth/private");
})

router.get("/main", (req, res,next) => {
  res.render("auth/main");
})

// router.get("/", (req, res) => {
//  // res.render("auth/login");
// });

module.exports = router;