const express = require("express");
const authRoutes = express.Router();

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = User({
          username,
          password: hashPass
        });

        newUser.save()
          .then(user => {
            res.redirect("/");
          })
          .catch(error => {
            next(error)
          })
      }
    });

  authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login");
  });

  authRoutes.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }


    authRoutes.get("/logout", (req, res, next) => {
      req.session.destroy((err) => {
        // cannot access session here
        res.redirect("/login");
      });
    });

});
});


module.exports = authRoutes;
