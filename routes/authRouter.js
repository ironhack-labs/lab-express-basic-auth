const express = require('express');
const router  = express.Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")
const bcryptSalt = 10;


//SIGN UP MADAFAKA

router.get("/signup",(req,res) => {
    res.render("auth/signup");
    });

router.post("/signup", (req, res) => {
    let { username, password } = req.body;
    User.findOne({ username: username }, "username", (err, user) => {
        if (user !== null) {
            res.render("auth/signup", {
              errorMessage: "The username already exists"
            });
            return;
          }
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);
          const newUser = User({ username,password: hashPass});
          newUser.save(err => {
            res.redirect("/");
          });
        });
      });

//LOG IN MADAFAKA

router.get("/login",(req,res) => {
    res.render("auth/login");
    });

router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Indicate a username and a password to login"
      });
      return;

    }
    User.findOne({ username: username }, (err, user) => {
      if (err || !user) {
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
      }
    });
  });
  

















module.exports = router;