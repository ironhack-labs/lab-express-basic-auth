// const { Router } = require("express");
// const router = new Router();

const router = require("express").Router();
const validator = require('validator'); 

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");
const mongoose = require("mongoose");

router.get("/signup", isLoggedOut, (req, res) => res.render("auth/signup"));

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', {errorMessage: "❌ You can't skip Username & Password!"})
    return;
  }

//validator (npm package): Your password needs to be between 8 and 30 characters long and 
// contain one uppercase letter, one symbol, and a number."
// MDN -> additional validation constraint
  if (!validator.isLength(password, {min:8, max:30}) ||
  !validator.isStrongPassword(password, {minLength:8, minLowercase:1,
    minUppercase: 1, minNumbers: 1, minSymbols: 1 }))
{res.status(500).render('auth/signup', {
  errorMessage: '😅 Your password needs to be between 8 and 30 characters long and contain one uppercase letter, one symbol, and a number.'
})
return;
}

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);

      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDb) => {
      console.log("Newly Created User!", userFromDb);
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error.code === 11000) {
        console.log(
          "😎 Username needs to be unique. This username is already used. ");
        res.status(500).render("auth/signup", {
          errorMessage: "😎 Username needs to be unique. This username is already used. ",
        });
      } else {
        next(error);
      }
    });
});


router.get("/userProfile", isLoggedIn, (req, res) => {
    res.render("users/user-profile", { userInSession: req.session.currentUser });
  });

//MIDDLEWARE!!!
// const private = require("../middleware/private");
// const showUser = (req, res) => {
//   res.render("users/user-profile", { userInSession: req.session.currentUser }); 
// } 
// next() from private.js file
// router.get("/userProfile",private, showUser) 
// => you can put as many as you want (middleware) like this!
// Same with the below;
// const private = require("../middleware/private");
// router.get("/userProfile", private, (req, res) => {
//   res.render("users/user-profile", { userInSession: req.session.currentUser });
// });


router.get("/login", isLoggedOut, (req, res) => res.render("auth/login"));

router.post("/login",isLoggedOut, (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;
  console.log(req.body);

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "🐣 Please enter both, username and password to login.",
    });
    return;
  }


  User.findOne({ username })
    .then((user) => {
      if (!user) {
        console.log("username not registered. ");
        res.render("auth/login", {
          errorMessage: "🦨 🦨 🦨 User not found and/or incorrect password.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        console.log("Incorrect password. ");
        res.render("auth/login", {
          errorMessage: "🥲 User not found and/or incorrect password.",
        });
      }
    })
    .catch((error) => next(error));
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});


const private = require("../middleware/private")
router.get("/private", private, (req, res) => {
res.render('auth/private')
})

const main = require("../middleware/main");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
router.get("/main", main,(req, res) => {
  res.render('auth/main')
  })

module.exports = router;
