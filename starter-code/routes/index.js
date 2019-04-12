const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

router.use(
  session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 100000000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", req.session);
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  let { username, password } = req.body;
  if (username !== "" && password !== "") {
    password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    User.create({ username, password }, { new: true }).then(user =>
      res.render("index", user)
    );
  }
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  let { username, password } = req.body;
  User.findOne({ username: username })
    .then(user => {
      if (
        username !== "" &&
        password !== "" &&
        bcrypt.compareSync(password, user.password)
      ) {
        req.session.user = user;
        res.render("index", user);
      }
    })
    .catch(err => console.log(err));
});
//Private middleware
router.use((req, res, next) => {
  req.session.user ?  next() : res.redirect("/login");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private", (req, res, next) => {
  res.render("private");
});

module.exports = router;
