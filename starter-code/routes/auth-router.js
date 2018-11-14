const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user-model.js");
const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("sign-form.hbs"); // senza slash o altre cose
});

router.get("/welcome", (req, res, next) => {
  res.render("welcome.hbs");
});

router.post("/signup", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  const encryptedpassword = bcrypt.hashSync(originalPassword, 10);
  User.create({ userName, encryptedpassword })
    .then(userDoc => {
      res.redirect("/");
    })
    .catch(err => next(err));
});
router.get("/login", (req, res, next) => {
  res.render("login-form.hbs");
});
router.get("/main", (req, res, next) => {
  res.render("main.hbs");
});

router.post("/login", (req, res, next) => {
  const { userName, originalPassword } = req.body;
  User.findOne({ userName: { $eq: userName } })
    .then(userDoc => {
      const { encryptedpassword } = userDoc;
      if (!bcrypt.compareSync(originalPassword, encryptedpassword)) {
        res.redirect("/main");
      } else {
        res.redirect("/welcome");
      }
    })
    .catch(err => next(err));
});

module.exports = router;
