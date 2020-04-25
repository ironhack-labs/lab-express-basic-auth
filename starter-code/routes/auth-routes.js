const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/User");


// GET ROUTES
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});


// POST ROUTES
router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and password",
        });
        // the return here avoids us using else statement
        return;
    }

    User.findOne({
            username: username
        })
        .then((user) => {
            if (user !== null) {
                res.render("auth/signup", {
                    errorMessage: "The username already exists!",
                });
                return;
            }

            User.create({
                    username,
                    password: hashPass,
                })
                .then(() => {
                    res.redirect("/");
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            next(error);
        });
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up.",
    });
    return;
  }

  User.findOne({
    username: theUsername,
  })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Invalid login",
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Invalid login",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;