const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const saltRounds = 13;
const router = Router();

router.get("/signup", (req, res) => {
    res.render("auth/signup");
  });

  router.get("/signup", (req, res, next) => {
  const { username, password } = req.body;
  bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => User.Login.create({username, password}))
    .then((user) => {
     console.log(user)
    })
    .catch((err) => next(err));
});
     
  
module.exports = router;