// const express = require("express");
// const router = express.Router();

const router = require("express").Router();
//USER WILL CONNECT TO DATABASE because in user model we connect database so we can now use it via User, I need it also to compare input with data in database
const User = require("../models/User.model");
//I NEED TO INSTALL Bcrypt!!!
const bcrypt = require("bcryptjs");

//Retrieve sign-up page
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  //console.log("Hello");
  const { username, password } = req.body;
  console.log(req.body);
  if (!username || !password) {
    res.render("signup", { errorMessage: "Please fill out all fields" });
    //when you do some response always return to leave function
    return;
  }
  User.findOne({ username }).then((userBack) => {
    if (userBack) {
      res.render("signup", { errorMessage: "Username already exists" });
      //when you do some response always return to leave function
      return;
    }

    const hashingAl = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, hashingAl);
    //console.log(username, hashedPassword);

    User.create({
      username,
      password: hashedPassword,
    }).then((newUser) => {
      //we redirect to get rid of/signup in URL
      console.log(newUser);
      res.redirect("/");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  //console.log(username, password);
  User.findOne({ username }).then((userFromDB) => {
    if (!userFromDB) {
      // error handle
      res.render("login", { errorMessage: "Please provide valid username" });
    }
    bcrypt.compare(password, userFromDB.password).then((isSamePassword) => {
      if (!isSamePassword) {
        //  error wrong password
        res.render("login", { errorMessage: "wrong password" });
      }
      // req.session.user || in this case, everytime we assign something to req.session we are storing it in the memory
      // DOWN is how we LOG IN
      //console.log(req.session.user);
      //req.session.user = userFromDB;
      res.redirect("/");
    });
  });
});

module.exports = router;
