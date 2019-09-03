const express = require("express");
const router = new express.Router();
const UserModel = require("../Model/user");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
  res.render("user/signup", { msg: "" });
});

router.post("/signup", (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    res.render("user/signup", { msg: "The fields can't be empty" });
    return;
  } else {
    UserModel.findOne({ username: user.username })
      .then(dbRes => {
        if (dbRes) {
          res.render("user/signup", { msg: "This username already exists" });
          return;
        }
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(user.password, salt);
        user.password = hashed;
        UserModel.create(user)
          .then(() => res.redirect("/"))
          .catch(err => console.log(err));
      })
      .catch(dbErr => next(dbErr));
  }
});

router.get("/login", (req, res) => {
  res.render("user/login", { msg: "" });
});

router.post("/login", (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    res.render("user/login", { msg: "Fill all the fields" });
    return;
  }
  UserModel.findOne({ username: user.username })
    .then(dbRes => {
      if (!dbRes) {
        res.render("user/login", { msg: "Bad username or password." });
        return;
      }
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        req.session.currentUser = user;
        res.redirect("/private");
        return;
      } else {
        res.render("user/login", { msg: "Bad username or password." });
        return;
      }
    })
    .catch(dbErr => next(dbErr));
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    res.locals.loggedin = "false";
    res.redirect("/");
  });
});

module.exports = router;
