const express 	   = require("express");
const bcrypt 	   = require("bcrypt");
const userModel    = require('../model/user');
const router       = express.Router();

router.get('/signin',(req, res, next) => {
    res.render('signin');
});


router.post("/signin", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("signin", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  userModel.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("signin", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the signin in the session!
        req.session.currentUser = user;
        res.redirect("/welcome");
      } else {
        res.render("signin", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

module.exports = router;
