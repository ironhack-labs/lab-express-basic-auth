const express = require("express");
const router = express.Router();
const userSchema = require("../models/user");
const checker = require("../src/js/fieldsVerification");
const bcrypt = require("../src/js/bcrypt");
const encriptPassword = bcrypt.encriptPassword;
const checkPassword = bcrypt.checkPassword;
const checkFields = checker.checkFields;
const checkUser = checker.checkUser;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  if (checkFields(req.body.username, req.body.password)) {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  } else {
    checkUser(req.body.username).then(promise => {
      if (promise) {
        res.render("signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }
      userSchema
        .create({
          username: req.body.username,
          password: encriptPassword(req.body.password)
        })
        .then(() => {
          console.log(`User ${req.body.username} was saved in the database`);
          res.redirect("/");
        })
        .catch(err => console.log("An error ocurred:", err));
    });
  }
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  if (checkFields(req.body.username, req.body.password)) {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
  } else {
    userSchema
      .findOne({ username: req.body.username })
      .then(user => {
        if (!user) {
          res.render("login", {
            errorMessage: "The username doesn't exist"
          });
          return;
        }
        if (checkPassword(req.body.password, user.password)) {
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("login", {
            errorMessage: "Incorrect Password"
          });
        }
      })
      .catch(err => console.log("An error ocurred:", err));
  }

  router.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  router.get("/main", (req, res, next) => {
    res.render("main");
  });

  router.get("/logout", (req, res, next) => {
    req.session.destroy(() => res.redirect("/login"));
  });
});

module.exports = router;
