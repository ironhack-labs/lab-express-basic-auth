const express = require("express");
const app = express();
// const router = express.Router();
const User = require("../models/User");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

////SIGN UP
app.get("/signup", (req, res) => {
  res.render("users/signup");
});

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log("signing up: ", username);

  if (username === "" || password === "") {
    res.render("users/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User
  .findOne({ username: username })
  .then(user => {
    if (user !== null) {
      console.log("Username already exists")
      res.render("users/signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }
    else {
      console.log("Creating user")
      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User.create({
        username: username,
        password: hashPass
      })
      .then(user => {
        console.log("User created")
        req.session.currentUser = user;
        res.redirect("/protected/main");
      })
      .catch(error => {
        console.log(error);
      });
    }
  });
});

//////LOGIN
app.get("/login", (req, res) => {
  res.render("users/login");
});

app.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("users/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User
    .findOne({ username: username })
    .then(user => {
      if (!user) {
        res.render("users/login", {
          errorMessage: "Invalid credentials"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/protected/main");
      }
      else {
        res.render("users/login", {
          errorMessage: "Invalid credentials"
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

///LOG OUT
app.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});



module.exports = app;
