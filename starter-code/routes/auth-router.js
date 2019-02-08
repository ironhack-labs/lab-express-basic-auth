const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user-models.js");
const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  // if (!originalPassword || !originalPassword.match(/[0-9]/)) {
  //   res.redirect("/signup");
  //   return;
  // }

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
  User.create({ userName, encryptedPassword })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("login-form.hbs");
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
      res.redirect("/");
    })
    .catch(err => next(err));
});

module.exports = router;
