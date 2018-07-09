const express = require("express");
const authRoutes = express.Router();
const User = require("../models/user");

//BCrypt

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get('/logout', (req, res) => {
  req.session.currentUser = "";
  res.redirect('/');
}); 

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  console.log(req.body);
  const userName = req.body.userName;
  const password = req.body.password;

  User.findOne({ userName: userName })
    .then(user => {
      if (user !== null) {
        throw new Error("Username Already exists");
      }
      if (userName == "" || password == "") {
        throw new Error("These fields cannot be empty");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        userName,
        password: hashPass
      });

      return newUser.save();
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.render("auth/signup", {
        errorMessage: err.message
      });
    });
});

authRoutes.post("/login", (req, res, next) => {
  const { userName, password } = req.body;
  let passCheck = new Promise((resolve, reject) => {
    if (userName === "" || password === "") {
      return reject(
        new Error("Please indicate a username and a password to sign up!!!")
      );
    }
    resolve();
  });
  passCheck
    .then(() => {
      return User.findOne({ userName: userName });
    })
    .then(user => {
      if (!user) throw new Error("The username doesn't exist!!!");
      if (!bcrypt.compareSync(password, user.password)) {
        throw new Error("Incorrect password!!!");
      }
      req.session.currentUser = user;
      console.log(`Logged in as ${user.userName}`);
      res.redirect("/");
    })
    .catch(e => {
      res.render("auth/login", {
        errorMessage: e.message
      });
    });
});

module.exports = authRoutes;
