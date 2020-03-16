const express = require('express');
const router  = express.Router(); 
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;      
const User = require('../models/User');    

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('auth/login');
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;

    if (username === "" || password === "") {
      return res.render("auth/signup", {
        errorMessage: "Indicate a username and a password to sign up"
      });
    }

  const userObject = await User.findOne({username: username})
    if (userObject !== null) {
      return res.render("auth/signup", {
        errorMessage: "The username already exists!"
      });
      } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt); 
      await User.create({username, password: hashPass})  
      res.redirect('/'); 
      }
    });

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
const theUsername = req.body.username.toLowerCase();
const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    return res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
  }

const userObject = await User.findOne({ username: theUsername })
    if (!userObject) {
        return res.render("auth/login", {
        errorMessage: "The username doesn't exist."
        });
      }
      if (bcrypt.compareSync(thePassword, userObject.password)) {
        req.session.currentUser = userObject;
        res.redirect("/user/main");
      } else {
        res.render("auth/login", {
        errorMessage: "Incorrect password"
        });
      }
});

router.get("/logout", (req, res, next) => {
      req.session.destroy(err => {
        res.redirect("/login");
      });
});

module.exports = router;