const express = require('express');
const router = express.Router();
const User = require(__dirname + "/../models/User.js");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(err => {
    if (err) {
      console.log(err);
    } else {
      res.render("dogsPage");
    }
  });
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("dogsPage");
        }
      }

    }
  });


});




module.exports = router;