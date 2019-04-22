const express = require("express");
const router = express.Router();
require("dotenv").config();

const User = require("../models/User");
const bcrypt = require("bcrypt");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  const config = {
    title: "Sign up",
    action: "/signup",
    button: "Sign up!"
  };
  res.render("auth/signup", config);
});

router.post("/signup", (req, res, next) => {
  const salt = bcrypt.genSaltSync(Number(process.env.ROUNDS));
  User.create({
    ...req.body,
    password: bcrypt.hashSync(req.body.password, salt)
  })
    .then(user => res.send(user))
    .catch(err => {
      if (String(err.errmsg).includes("E11000 duplicate key"))
        res.render("auth/signup", config, {
          err: "Sorry, this user already exists :(",
          title: "Sign up",
          action: "/signup",
          button: "Sign up!"
        });
      if (err)
        res.render("auth/signup", {
          err: "Sorry, user cannot be empty :(",
          title: "Sign up",
          action: "/signup",
          button: "Sign up!"
        });
      console.log(err);
    });
});

router.get("/login", (req, res, next) => {
  const config = {
    title: "Login",
    action: "/login",
    button: "Login!"
  };
  res.render("auth/signup", config);
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (!bcrypt.compareSync(password, user.password))
        return res.render("auth/signup", {
          err: "Access denied!",
          title: "Login",
          action: "/login",
          button: "Login!"
        });
      req.session.currentUser = user;
      req.app.locals.loggedUser = user;
      res.redirect("private");
    })
    .catch(err => console.log(err));
});

router.get("/private", isLogged, (req, res, next) => {
  res.render("private");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/private");
});

function isLogged(req, res, next) {
  if (!req.session.currentUser) return res.redirect("/login");
  next();
}

module.exports = router;
