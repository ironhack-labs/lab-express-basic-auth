const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      console.log("User has logged in");
      next();
    } else {
      res.redirect("/login");
    }
  };
};

router.get("/profile", loginCheck(), (req, res, next) => {
  console.log(req.cookies, "The cookies");
  res.cookie("myCookie", "Nate");
  console.log(req.session.user._id, "The user id");
  res.render("profile");
});

module.exports = router;
