const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Session = require("../models/Session.model");

router.get("/signup", (req, res, next) => {
  res.render("signUp");
});

router.post("/signup", (req, res, next) => {
  const { password, email, username } = req.body;

  const saltRounds = 12;

  const salt = bcrypt.genSaltSync(saltRounds);

  const newPassword = bcrypt.hashSync(password, salt);

  req.body.password = newPassword;

  User.create(req.body).then(res.redirect("../")).catch(console.log);
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).json({ errorMessage: "Wrong credentials." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).json({ errorMessage: "Wrong credentials." });
        }

        req.session.currentuser = username;
        res.redirect('/')
      });
    })
    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

module.exports = router;
