const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
  res.render("auth/sign-up");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/signup", (req, res, next) => {
  const user = req.body;

  if (!user.username || !user.password) {
    res.redirect("/auth/signup");
    return;
  } else {
    userModel
      .findOne({ username: user.username })
      .then(dbRes => {
        if (dbRes) return res.redirect("/auth/signup");

        const salt = bcrypt.genSaltSync(10); 
        const hashed = bcrypt.hashSync(user.password, salt);
        user.password = hashed;

        userModel
          .create(user)
          .then(() => res.redirect("/auth/login"))  
      })
      .catch(next);
  }
});

router.post("/login", (req, res, next) => {
  const user = req.body;

  if (!user.username || !user.password) {
    req.flash("error", "wrong credentials");
    return res.redirect("/auth/login");
  }

  userModel
    .findOne({ username: user.username })
    .then(dbRes => {
      if (!dbRes) {
        req.flash("error", "wrong credentials");
        return res.redirect("/auth/login");
      }
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        const { _doc: clone } = { ...dbRes };
        
        delete clone.password;
        
        req.session.currentUser = clone;
        return res.redirect("/");
      } else {
        return res.redirect("/auth/login");
      }
    })
    .catch(next);
});

// action::Logout

/* router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.locals.isLoggedIn = undefined;
    res.locals.isAdmin = undefined;
    res.redirect("/auth/signin");
  });
}); */

module.exports = router;
