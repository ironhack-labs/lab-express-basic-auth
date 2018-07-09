const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const brcyptSalt = 10;
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const Login = require("../models/User.js");

router.get("/", (req, res, next) => {
  res.render("login");
});
router.post("/", (req, res, next) => {
  const { name, password } = req.body;
  if (name == "" || password == "") {
    throw new Error("Empty username or password");
  }

  Login.findOne({
    name: name
  })
    .then(user => {
      if (!user) throw new Error("Username does not exist.");
      if (!bcrypt.compareSync(password, user.password))
        throw new Error("Incorrect password");
      req.session.currentUser = user;
      res.redirect("/");

    })

    .catch(err => {
      res.render("login", {
        errorMessage: err.message
      });
    });
});

module.exports = router;
