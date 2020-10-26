const express = require('express');
const router = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
  });

  router.post("/signup", async (req, res, next) => {
    if (req.body.username === "" || req.body.password === "") {
      res.render("auth/signup", {
        errorMessage: "Indicate a username and a password to sign up",
      });
      return;
    }

    const { username, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
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
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  });
  
  router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });
  
  router.post("/login", async (req, res, next) => {
    if (req.body.username === "" || req.body.password === "") {
      res.render("auth/login", {
        errorMessage: "Indicate a username and a password to login",
      });
      return;
    }
  
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist",
        });
        return;
      }
  
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password",
        });
      }
    } catch (error) {}
  });
  
  router.get("/main", (req, res, next) => {
    res.render("main");
  });
  
  router.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });
  
  router.get("/private", function (req, res, next) {
    res.render("private");
  });
  

module.exports = router;
