const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");

router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.genSalt(10).then((salt) => {
    bcrypt.hash(password, salt).then((hashedPassword) => {
      UserModel.create({
        name,
        email,
        password: hashedPassword,
      }).then(() => {
        console.log(hashedPassword, name, email);
        res.redirect("/");
      });
    });
  });
});

router.get("/login", (req, res) => {
  res.render("auth/login.hbs");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email: email }).then((userData) => {
    console.log(userData);
    bcrypt.compare(password, userData.password).then((result) => {
      //check if result is true
      if (result) {
        // userName = userData.name
        req.session.loggedInUser = userData;
        res.redirect("/dashboard");
      } else {
        res
          .status(500)
          .render("auth/login.hbs", { message: "Passwords not matching" });
      }
    });
  });
});

router.get("/dashboard", (req, res) => {
  //show dashboard page
  res.render("dashboard.hbs", { name: req.session.loggedInUser.name });
});

module.exports = router;
