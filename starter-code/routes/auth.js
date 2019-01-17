const express     = require("express");
const router      = express.Router();
const User        = require("../models/user");

const bcrypt      = require("bcrypt");
const bcryptSalt  = 10; 

router.get("/signup", (req, res, next) =>{
  res.render("auth/signup")
})

router.post("/signup", (req, res, next )=>{
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = User ({
    username,
    password: hashPass
  });

  newUser.save()
  .then(user => {
    res.redirect("/")
  }).catch(err=> {
    console.log(err);
    next(err)
  });
})

module.exports = router;