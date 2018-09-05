const express = require('express');
const bcrypt = require("bcrypt");
const User = require("../models/user-model.js");
const router  = express.Router();

router.get("/signup", (req,res,next) => {
  res.render("auth-views/signup-form.hbs");
})

router.post("/process-signup", (req,res,next) => {
  const {userName,userPassword} = req.body;
  const encryptedPassword = bcrypt.hashSync(userPassword, 10);
  User.create({userName,encryptedPassword})
  .then(userDoc => {
    req.flash("success", "sign up success !");
    res.redirect("/");
  })
  .catch(err => next(err) );
});

router.get("/login", (req,res,next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req,res,next) => {
  const {userName, userPassword} = req.body;
  User.findOne({ userName: { $eq: userName}})
    .then( userDoc => {
      if(!userDoc) {
        req.flash("error","incorrect username");
        res.redirect("/login");
        return;
      }

      const {encryptedPassword} = userDoc;

      if(!bcrypt.compareSync(userPassword,encryptedPassword)) {
        req.flash("error", "wrong password");
        res.redirect("/login");
        return;
      }
      req.flash("success", "log in success !!");
      res.redirect("/");
    })
    .catch(err => next(err));
})

module.exports = router;
