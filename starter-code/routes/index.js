const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/**
 * /private
 * GET
 * Shows a protected route
 */

router.get("/private", (req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user).then(userInfo => {
      res.render("private/index", { userInfo });
    });
  } else {
    res.redirect("/login");
  }
});

/**
 * /signup
 * GET
 * Show a form to create a user
 */

router.get("/signup", (req, res) => {
  if (req.query.error) {
    if (req.query.error === "empty") {
      res.render("auth/signup", {
        error: "The provided username and/or password were empty"
      });
    }

    if (req.query.error === "user-exists") {
      res.render("auth/signup", {
        error: "The provided username already exists"
      });
    }
  } else {
    res.render("auth/signup");
  }
});

/**
 * /signup
 * POST
 * Send the data from the form to this route to create the user and save it to the database
 */

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username.length === 0 || password.length === 0) {
    return res.redirect("/signup?error=empty");
  }

  User.findOne({ username: username })
    .then(foundUser => {
      if (foundUser === null) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedPassword = bcrypt.hashSync(password, salt);

        User.create({ username: username, password: encryptedPassword }).then(
          createdUser => {
            res.redirect("/login");
          }
        );
      } else {
        res.redirect("/signup?error=user-exists");
      }
    })
    .catch(error => next(error));
});

/**
 * /login
 * GET
 * Show a form to login a user
 */

router.get("/login", (req, res) => {
  if (req.query.error) {
    if (req.query.error === "empty") {
      res.render("auth/login", {
        error: "The provided username and/or password were empty"
      });
    }

    if (req.query.error === "user-exists") {
      res.render("auth/login", {
        error: "The provided username already exists"
      });
    }

    if (req.query.error === "forbidden") {
      res.render("auth/login", {
        error: "Access forbidden: You must Log In to navigate this private zone"
      });
    }

    if (req.query.error === "wrong-password") {
      res.render("auth/login", {
        error: "Wrong password!"
      });
    }
  } else {
    res.render("auth/login");
  }
});

/**
 * /login
 * POST
 * Send the data from the form to this route to authenticate the user
 */

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username.length === 0 || password.length === 0) {
    return res.redirect("/login?error=empty");
  }

  User.findOne({ username: username }).then(foundUser => {
    if (foundUser === null) {
      res.redirect("/login?error=no-user-exists");
    } else {
      if (bcrypt.compareSync(password, foundUser.password)) {
        req.session.user = foundUser._id;
        res.redirect("/private");
      } else {
        res.redirect("/login?error=wrong-password");
      }
    }
  });
});

/**
 * /logout
 * GET
 * Destroys the session of the logged user
 */

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/login");
  });
});

module.exports = router;
