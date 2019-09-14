const express = require("express");
const router = express.Router();
const Users = require("../models/databaseModel");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res, next) => {
  if (req.query.error) {
    if (req.query.error === "empty") {
      res.render("signup", {
        error: "The provided username and/or password were empty"
      });
    }
    if (req.query.error === "user-exists") {
      res.render("signup", { error: "The provided username already exists" });
    }

    if (req.query.error === "not-logged-in") {
      res.render("signup", { error: "The provided username already exists" });
    }
    if (req.query.error === "validate-error") {
      res.render("signup", { error: `User name has to be 6 to 10 characters long. Space characters are not allowed. 
      Your password needs at least one lower case letter, one upper case, one special character, 
      one number and more than 6 chars long. User and password cannot be equals.` });
    }
  } else {
    res.render("signup");
  }
});

router.post("/signup", (req, res, next) => {
  const userName = req.body.username;
  const passWrd = req.body.password;
  if (userName === "" || passWrd === "") {
    res.redirect("/signup?error=empty");
  }

  Users.findOne({ username: userName }).then(userInDb => {
    if (userInDb === null) {
      if (validateUserAndPassword(userName, passWrd)) {
        const saltRounds = 10;

        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedPassword = bcrypt.hashSync(passWrd, salt);

        Users.create({ username: userName, password: encryptedPassword }).then(
          userInDb => {
            req.session.user = userInDb._id;
            res.redirect("/main");
          }
        );
      } else {
        res.redirect("/signup?error=validate-error");
      }
    } else {
      res.redirect("/signup?error=user-exists");
    }
  });
});

router.get("/login", (req, res, next) => {
  if (req.query.error) {
    if (req.query.error === "empty") {
      res.render("login", {
        error: "The provided username and/or password were empty"
      });
    }

    if (
      req.query.error === "user-unknown" ||
      req.query.error === "wrong-password"
    ) {
      res.render("login", { error: "Wrong user or password" });
    }

    if (req.query.error === "not-logged-in") {
      res.render("login", { error: "You are not logged in" });
    }
  } else {
    res.render("login");
  }
});

router.post("/login", (req, res, next) => {
  const userName = req.body.username;
  const passWrd = req.body.password;
  if (userName === "" || passWrd === "") {
    res.redirect("/login?error=empty");
  }

  Users.findOne({ username: userName }).then(userInDb => {
    if (userInDb === null) {
      res.redirect("/login?error=user-unknown");
    } else {
      Users.findOne({ username: userName }).then(userInDb => {
        const hashed = userInDb.password;

        if (bcrypt.compare(passWrd, hashed)) {
          req.session.user = userInDb._id;
          res.redirect("/main");
        } else {
          res.redirect("/login?error=wrong-password");
        }
      });
    }
  });
});

router.get("/main", (req, res, next) => {
  let userLogged;
  Users.findById(req.session.user).then(user => {
    userLogged = user;
    if (req.session.user) {
      res.render("main", { userLogged });
    } else {
      res.redirect("/login?error=not-logged-in");
    }
  });
});

router.get("/private", (req, res, next) => {
  let userLogged;
  Users.findById(req.session.user).then(user => {
    userLogged = user;
    if (req.session.user) {
      res.render("private", { userLogged });
    } else {
      res.redirect("/login?error=not-logged-in");
    }
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

function validateUserAndPassword(user, password) {
  const strongPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
  const validUser = /\s/;
  return user != password && user.length >= 6 && user.length <= 10 && !validUser.test(user) && strongPassword.test(password);
}

module.exports = router;
