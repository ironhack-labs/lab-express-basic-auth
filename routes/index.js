const express = require("express");
const router = express.Router();
const Login = require("../models/Login");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/singUp", (req, res, next) => {
  res.render("singUp");
});

router.post("/newUser", (req, res, next) => {
  const { user, password } = req.body;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  const newUser = new Login({ user, password:hashPass });
  newUser
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
