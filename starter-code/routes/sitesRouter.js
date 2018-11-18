const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");


/* GET home page */
router.get('/', (req, res, next) => {
  const user = req.session.currentUser;
  res.render('index', {user});
});


router.get("/secret", (req, res, next) => {
  const user = req.session.currentUser;
  if(req.session.currentUser){
    res.render("secret", {user});
    }else{
      res.redirect("/")
    }
});


module.exports = router;
