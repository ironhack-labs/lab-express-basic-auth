const router = require("express").Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* Signup Page */
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if(username ==="" || User.find(username) || password==="" ){
    res.render("signup", { errorMessage: "Username or password incorrect" })
  }
  else{
    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(password, salt))
      .then((hashedPassword) => {
        User.create({ username: username, password: hashedPassword });
      })
      .catch((error) => next(error));
    res.redirect("/profile");
  }
});

/* Connection Page */
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username: username })
    .then((userFromDb) => {
      if (userFromDb && bcryptjs.compareSync(password, userFromDb.password)) {
        req.session.currentUser = userFromDb;
        res.redirect("/profile");
      } else {
        res.render("login", { errorMessage: "Username or password incorrect" });
      }
    })
    .catch((error) => {
      console.error("Error while connecting to db", error);
      next(error);
    });
});

router.get("/profile", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("profile");
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("main");
  } else {
    res.redirect("/login");
  }
});

router.get("/private", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("private");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
