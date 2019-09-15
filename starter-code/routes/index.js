const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
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
  } else {
    res.render("signup");
  }
});

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
    return res.redirect("/signup?error=empty");
  }

  Users.findOne({ username: username }).then(foundUserData => {
    if (foundUserData === null) {
      const saltRounds = 5;

      const salt = bcrypt.genSaltSync(saltRounds);
      const encryptedPassword = bcrypt.hashSync(password, salt);

      Users.create({ username: username, password: encryptedPassword }).then(
        createdUserData => {
          res.json({ userCreated: true, createdUserData });
        }
      );
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

    if (req.query.error === "user-doesnot-exist") {
      res.render("login", { error: "The provided username does not exist" });
    }

    if (req.query.error === "wrong-password") {
      res.render("login", { error: "The provided password is incorrect" });
    }
  } else {
    res.render("login");
  }
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
    return res.redirect("/login?error=empty");
  }

  Users.findOne({ username: username }).then(foundUserData => {
    if (foundUserData === null) {
      res.redirect("/login?error=user-doesnot-exist");
    } else {
      const bcrypt = require("bcrypt");
      const hashedPassword = foundUserData.password;

      if (bcrypt.compareSync(password, hashedPassword)) {
        req.session.user = foundUserData._id;
        res.redirect("/main");
      } else {
        res.redirect("/login?error=wrong-password");
      }
    }
  });
});

router.get("/main", (req, res) => {
  if (req.session.user) {
    Users.findById(req.session.user).then(yourInfo => {
      res.render("main", { yourInfo: yourInfo });
    });
  } else {
    res.redirect("/login");
  }
});
router.get("/private", (req, res) => {
  if (req.session.user) {
    Users.findById(req.session.user).then(yourInfo => {
      res.render("private", { yourInfo: yourInfo });
    });
  } else {
    res.redirect("/login");
  }
});
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/login");
  });
});

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
