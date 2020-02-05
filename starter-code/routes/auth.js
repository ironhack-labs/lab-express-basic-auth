const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    res.render("signup.hbs", {
      errorMessage: "Please provide a username."
    });
    return;
  }
  if (password.length < 6) {
    res.render("signup.hbs", {
      errorMessage: "Password must be at least 6 characters long."
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("signup.hbs", {
          errorMessage: "That username is already taken."
        });
        return;
      }
      //   return bcrypt.hash(password, 10);
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      return User.create({ username: username, password: hash });
    })
    // .then(hash => {
    //   console.log("hashed! 🎉");
    //   return User.create({ username: username, password: hash });
    // })
    .then(createdUser => {
      if (createdUser) {
        console.log("created User! 🎉");
        console.log(createdUser);

        req.session.user = createdUser;
        res.redirect("/");
      }
    })
    .catch(err => {
      console.log("Error! ❌");
      next(err);
    });
});

router.get("/login", (req, res) => {
  res.render("login.hbs");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (!password) {
    res.render("login.hbs", {
      errorMessage: "Please provide password."
    });
    return;
  }

  let user;
  User.findOne({ username })
    .then(existingUser => {
      if (!existingUser) {
        res.render("login.hbs", {
          errorMessage: "Username does not exist in database."
        });
        return;
      }

      user = existingUser;
      const match = bcrypt.compareSync(password, existingUser.password);
      if (!match) {
        console.log("wrong password ❌");
        res.render("login.hbs", { errorMessage: "Invalid credentials" });
        return;
      }
      // log user in
      req.session.user = user;
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
