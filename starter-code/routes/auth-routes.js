const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require("../models/user-model.js");

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  if (!originalPassword || !originalPassword.match(/[0-9]/)) {
    res.redirect("/signup");
    return;
  }

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ userName, encryptedPassword })
    .then(() => {
      res.redirect("/signup-success");
    })
    .catch(err => next(err));
});

router.get("/signup-success", (req, res, next) => {
  res.render("auth-views/sign-success.hbs");
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/logform.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  User.findOne({ userName: { $eq: userName } })
    .then(userDoc => {
      if (!userDoc) {
        res.redirect("/login");
        return;
      }

      const { encryptedPassword } = userDoc;

      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        res.redirect("/login");
        return;
      }
      res.redirect("/log-success");
    })
    .catch(err => next(err));
});

router.get("/log-success", (req, res, next) => {
  res.render("auth-views/log-success.hbs");
});

module.exports = router;
