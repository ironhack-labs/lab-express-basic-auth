const router = require("express").Router(); 
const User = require("../models/User.model"); 
const bcrypt = require("bcryptjs");

const loginChecker = () => {
  return (req, res, next) => {
    if (req.session.user !== undefined) {
      next()
    } else {
    res.redirect("/signup")
    }
  }
} 

// GET homepage
router.get("/", (req, res, next) => {
  res.render("index");
})

// GET main page 
router.get("/main", loginChecker(), (req, res, next) => {
  res.render("main");
})

// GET private page
router.get("/private", loginChecker(), (req, res, next) => {
  res.render("private");
})

module.exports = router;