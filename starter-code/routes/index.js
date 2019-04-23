const express = require('express');
const router  = express.Router();
const authRoutes = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


authRoutes.get("/auth/signup", (req, res, next) => {
  res.render('signup');
});

router.get('/private',(req,res) => {
  if(req.session.currentUser){
      res.render('private');
  }else{
      res.redirect('/');
  }
})


module.exports = router;
