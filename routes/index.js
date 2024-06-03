const router = require("express").Router();
const saltRounds = 10
const bcrypt = require('bcrypt');

/* GET home page */
const express = require("express");
const User = require("../models/User.model");

router.get("/", (req, res, next) => {
  res.render("../views/index.hbs");
});

router.get("/signup", (req, res, next) => {
  res.render("../views/signup.hbs");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  
  if (username === "" || password === "") {
    return res.status(400).render("../views/signup.hbs", { errorMessage: "All fields are mandatory" });
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword });

    res.redirect("/login");
  } catch (error) {
    next(error);
  }
});

router.get("/login", (req, res, next) => {
  res.render("../views/login");
});
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      bcrypt.compare(password, user.password)
        .then(match => {
          if (match) {
            res.redirect("/loged-in")
          } else {
            res.status(401).send('Invalid credentials');
          }
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));  
});
router.get("/loged-in", (req, res, next) => {
  res.render("../views/loged-in");
});
router.get("/private", (req, res, next) => {
  res.render("../views/private");
});
module.exports = router;
