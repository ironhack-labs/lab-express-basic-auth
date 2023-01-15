const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User.model");
const saltRounds = 10;
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

// SIGN UP
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      console.log("LabSalt", salt);

      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      console.log("Hashed Password ", hashedPassword);
      return User.create({
        email: email,
        passwordHash: hashedPassword,
      });
    })
    .then((result) => {
      console.log(result);
      res.redirect("/profile");
    })
    .catch((err) => {
      console.log(err);
    });
});

// LOGIN
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// PROFILE
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("user/user-profile", { userInSession: req.session.currentUser });
});

//Iteration 3: /main

router.get("/main", isLoggedIn, (req, res) => {
  res.render("user/main", { userInSession: req.session.currentUser });
});

//Iteration 3: /private

router.get("/private", isLoggedIn, (req, res) => {
  res.render("user/private", { userInSession: req.session.currentUser });
});

router.post("/login", (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  console.log(req.body)
  const { email, password } = req.body;

  if (!email || !password) {
    res.render("auth/login", {
      errorMessage: "Please enter your email and password to login.",
    });
    return;
  }
  User.findOne({ email })
  .then(user => {
    console.log(user);
    if (!user) {
      res.render("auth/login", {
        errorMessage: "User not found",
      });
    } else if (bcrypt.compareSync(password, user.passwordHash)) {
      req.session.currentUser = user;
      res.redirect("/profile"); 
      
    } else {
      res.render("auth/login", { 
        errorMessage: "Incorrect password" });
    }
  })
  .catch(error => next(error));
});

router.get("/about-me",(req,res)=>{
  res.render("user/about-me",{userInSession:req.session.currentUser})
})

router.post("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
