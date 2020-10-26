const express = require("express");
const router = express.Router();

// User model
const User = require("../models/User.model");

// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");
//const { findOne } = require("../models/User.model");
const bcryptSalt = 10;

// Sign Up page

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
  });

  router.post("/signup", async (req, res, next) => {
    
    const { username, password } = req.body;
    console.log(username, password)
    if (username === "" || password === "") {
      res.render("auth/signup", {
        errorMessage: "Indicate a username and a password to sign up",
      });
      return;
    }
  
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
  
    try {
      const user = await User.findOne({ username: username });
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!",
        });
        return;
      }
  
      await User.create({
        username,
        password: hashPass,
      });
      res.render("index", { message: "User created" });
    } catch (error) {
        res.status(500).send(error);
    }
  });

  
router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });

  router.post("/login", (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;
   
    if (theUsername === "" || thePassword === "") {
      res.render("auth/login", {
        errorMessage: "Please enter both, username and password to sign up."
      });
      return;
    }
   
    User.findOne({ "username": theUsername })
    .then(user => {
        if (!user) {
          res.render("auth/login", {
            errorMessage: "The username doesn't exist."
          });
          return;
        }
        if (bcrypt.compareSync(thePassword, user.password)) {
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
    })
    .catch(error => {
      res.status(500).send(error);
    })
  });


  router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
      next(); // ==> go to the next route ---
    } else {                          //    |
      res.redirect("/login");         //    |
    }                                 //    |
  }); // ------------------------------------                                
  //     | 
  //     V
  router.get("/private", (req, res, next) => {
    res.render("private");
  });
  
  router.get("/main", (req, res, next) => {
    res.render("main");
  });
  

  module.exports = router;