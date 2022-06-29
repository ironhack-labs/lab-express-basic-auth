const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (password.length < 4) {
    res.render("signup", { message: "Password has to be 4 chars min" });
    return;
  }
  if (username === "") {
    res.render("signup", { message: "Username cannot be empty" });
    return;
  }

  User.findOne({ username: username }).then((userFromDB) => {
    if (userFromDB !== null) {
      res.render("signup", { message: "Your username is already taken" });
      return;
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username: username, password: hash })
        .then((createdUser) => {
          console.log(createdUser);
          res.redirect("/");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username: username }).then((userFromDB) => {
    if (userFromDB === null) {
      res.render("login", { message: "Invalid credentials" });
      return;
    }
    if (bcrypt.compareSync(password, userFromDB.password)) {
      req.session.user = userFromDB;
      res.redirect("/main");
    }
  });
});
module.exports = router;
