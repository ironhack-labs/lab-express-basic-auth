

const express = require('express');
const router  = express.Router();


const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const mongoose = require("mongoose");
const Users = require("../models/User");



/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get("/signup", (req, res) => {
  res.render("signup");
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/signup", (req, res) => {
  const saltRounds = 10;
  if (req.body.username === "" || req.body.password === "") {
    res.json({ authorised: false, reason: "Bad credentials" });
    return;
  }
  const plainPassword1 = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword1, salt);
  Users.findOne({ name: req.body.username }).then((userFound) => {
    if (userFound !== null) {
      res.json({ authorised: false, reason: "User exists" });
    } else {
      Users.create({ name: req.body.username, password: hash })
        .then((userCreated) => {
          res.json({ created: true, userCreated });
        })
        .catch(() => {
          res.json({ created: false });
        });
    }
  });
});


module.exports = router;
