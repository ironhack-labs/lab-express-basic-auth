const express = require("express");
const router = express.Router();


router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private", (req, res, next) => {
  if (req.session.currentUser){
    res.render("private");
  }else{
    res.render("index");
  }
});


module.exports = router;
