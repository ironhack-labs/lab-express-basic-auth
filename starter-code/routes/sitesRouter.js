const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");


/* GET home page */
router.get('/', (req, res, next) => {
  const user = req.session.currentUser;
  if(req.session.currentUser){
    res.render('index', {user});
  } else{
    res.render('index');
  }
});

router.get("/main", (req, res, next) => {
  const user = req.session.currentUser;
  if(req.session.currentUser){
    res.render("main", {user});
  } else{
    res.redirect("/")
  }
});

router.get("/private", (req, res, next) => {
  const user = req.session.currentUser;
  if(req.session.currentUser){
    res.render("private", {user});
  } else{
    res.redirect("/")
  }
});


module.exports = router;
