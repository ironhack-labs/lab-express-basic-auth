const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");

// // BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPass
  })
  .then(() => {
    res.redirect("/");
  })
  .catch(error => {
    res.render('auth/signup', {
      errorMessage: "Indicate a valid username and password"
    })
    console.log(error);
  })
});


router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;

  // 
  User.findOne({ username })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Indicate a valid username and password"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Indicate a valid username and password"
        });
      }
  })
  .catch(error => {
    res.render('auth/login', {
      errorMessage: "Indicate a valid username and password"
    })
    console.log(error);
  })
})


router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next(); 
  } else {                         
    res.redirect("/");         
  }                                 
}); 

router.get("/private", (req, res, next) => {
  res.render("private");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;