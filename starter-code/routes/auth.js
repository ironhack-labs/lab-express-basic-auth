const express = require("express");
const router = express.Router();

const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res) => {
  res.render('auth/signup');
})

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPwd = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPwd
  })
    .then(() => { res.redirect("/") })
    .catch(error => { console.log(error) })
})

module.exports = router