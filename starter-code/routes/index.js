const express = require("express");
const session = require("express-session");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const genericUser = new User();
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.post("/", (req, res, next) => {
  const saltRounds = 6;

  genericUser.user = req.body.user;
  
  if (req.body.user === "" || req.body.password === "") {
    console.log("error vacio");
  } else {
    
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);
    genericUser.password = hash;
  
    genericUser.save().then(user => {
      // req.session.inSession = true
      res.render("main", { user: user.user });
    });
  }
});

module.exports = router;
