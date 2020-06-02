const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  UserModel.create({
    username,
    password: hashPass,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/signin", (req, res) => {
  res.render("auth/signin.hbs");
});

router.post("/signin", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(500).render("auth/signup.hbs", {
      errorMessage: "Please enter username, email and password",
    });
    return;
  }

  // Find if the user exists in the database
  UserModel.findOne({ username })
    .then((userData) => {
      //check if passwords match
      bcrypt
        .compare(password, userData.password)
        .then((doesItMatch) => {
          //if it matches
          if (doesItMatch) {
            // req.session is the special object that is available to you

            req.session.loggedInUser = userData;
            res.redirect("/private");
          }
          //if passwords do not match
          else {
            res.status(500).render("auth/signin.hbs", {
              errorMessage: "Password does not match",
            });
            return;
          }
        })
        .catch(() => {
          res.status(500).render("auth/signin.hbs", {
            errorMessage: "Something went wrong!",
          });
          return;
        });
    })
    //throw an error if the user does not exists
    .catch(() => {
      res.status(500).render("auth/signin.hbs", {
        errorMessage: "Something went wrong",
      });
      return;
    });
});

router.get("/main", (req, res) => {
  if (req.session.loggedInUser) {
    res.render("profile/main.hbs");
  } else {
    res.send("Access Denied");
  }
});

router.get("/private", (req, res) => {
  if (req.session.loggedInUser) {
    res.render("profile/private.hbs");
  } else {
    res.send("Access Denied");
  }
});

module.exports = router;
