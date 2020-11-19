const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const salt = 10;

//middleware
const shouldNotBeLogged = (req, resp, next) => {
  if (req.session.user) {
    return resp.render("index", { errMessage: "Already logged in" });
    console.log("already logged in", req.session.user);
  }
  next();
};

router.get("/login", shouldNotBeLogged, (req, resp, next) => {
  resp.render("auth/login.hbs");
});

router.post("/auth/login", (req, resp, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return resp.render("auth/login", {
      errorMessage: "Please fill in all the fields",
    });
  }

  User.findOne({ username })
    .then((foundUser) => {
      if (foundUser) {
        console.log("user found");
        bcrypt.compare(password, foundUser.password).then((samePassword) => {
          console.log("is it the same password? True or false:", samePassword);
          if (samePassword) {
            console.log("getting the session id and redirecting");
            req.session.user = foundUser;
            resp.redirect("/");
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// SIGN UP******

router.get("/signup", (req, resp, next) => {
  resp.render("auth/signup.hbs");
});

router.post("/auth/signup/", (req, resp, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return resp.render("auth/signup", {
      errorMessage: "Please fill in all the fields",
    });
  }

  User.findOne({ username }).then((foundUser) => {
    console.log(foundUser);
    if (!foundUser) {
      bcrypt
        .genSalt(salt)
        .then((generatedSalt) => {
          return bcrypt.hash(password, generatedSalt);
        })
        .then((hashedPassword) => {
          return User.create({ username, password: hashedPassword });
        })
        .then((userCreated) => {
          req.session.user = userCreated;
          resp.redirect("/");
          console.log("user created", userCreated);
        });
    }

    if (foundUser) {
      resp.render("auth/signup", {
        errorMessage: "Either username or email is already taken",
      });
    }
  });
});

module.exports = router;
