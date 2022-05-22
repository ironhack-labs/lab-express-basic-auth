const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res, next) => {
  res.render("signUp");
});

router.post("/signup", (req, res, next) => {
  const { password, email, username } = req.body;

  const saltRounds = 12;

  const salt = bcrypt.genSaltSync(saltRounds);

  const newPassword = bcrypt.hashSync(password, salt);

  req.body.password = newPassword;

  User.create(req.body).then(res.redirect("../")).catch(console.log);
});

module.exports = router;
