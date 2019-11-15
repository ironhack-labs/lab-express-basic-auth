const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const bcryptSalt = 10;

router.get("/", (req, res) => res.render("login"));

router.post("/", (req, res) => {
  const { username, password } = req.body;

  if (bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user;
    res.redirect("/private");
  } else if (!username || !password) {
    res.render("login", {
      errorMessage: "please fill out all fields"
    });
  } else {
    res.redirect("/");
  }
});

router.use((req, res) => {
  console.log(req.session);
  req.session.currentUser ? next() : res.redirect("/");
});

router.get("/private", (req, res) =>
  res.render("private-page", {
    user: req.session.currentUser
  })
);

module.exports = router;
