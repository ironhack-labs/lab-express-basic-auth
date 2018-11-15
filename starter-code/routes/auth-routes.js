const express = require("express");

const bcrypt = require("bcrypt");

const User = require("../models/user-model.js")

const router = express.Router();

//Route to the Sign Up Form
router.get("/signup", (req, res, next) => {
  res.render("auth-views/setup-form.hbs");
});


router.post("/process-form", (req, res, next) => {
  const { username, originalPassword } = req.body;
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10)

  if (!username || !originalPassword) {
    req.flash("error", "Your username or password can't be blank");
    res.redirect("/signup");
    return;
  }

  User.create({ username, encryptedPassword })
  .then(userDoc => 
    req.flash("success", "Sign up success !"),
    res.redirect("/"))
  .catch(err => next(err));
});

//LOG IN 
router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
})

router.post("/process-login", (req, res, next) => {
  const { username, originalPassword } = req.body;

  User.findOne({username: { $eq: username }})
  .then(userDoc => {

    if (!userDoc) {
      req.flash("error", "Wrong Username. Try again !");
      res.redirect("/login");
      return;
    }

    const { encryptedPassword } = userDoc;

    // compare to know if the password is good or not
    if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
      req.flash("error", "Incorrect password ! 😰")
      res.redirect("/login");
    }
    else {
      req.flash("success", "Login Success ! 🙌🏻")
      req.session.isLogged = true;
      res.redirect("/");
    }
  })
  .catch(err => next(err));
});

router.get("/main", (req, res, next) => {
  if (req.session.isLogged) {
    res.render("auth-views/main");
  }
  else {
    req.flash("error", "You've got to be logged in to see this page. 🛑")
    res.redirect("/");
  }
})

router.get("/private", (req, res, next) => {
  if (req.session.isLogged) {
    res.render("auth-views/private");
  }
  else {
    req.flash("error", "You've got to be logged in to see this page. 🛑")
    res.redirect("/");
  }
})

module.exports = router;

