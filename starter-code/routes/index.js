const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;


router.get("/", (req, res, next) => {
  if(req.session) {
    res.redirect("/main");
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res, next) => {
  res.render("main", {name: req.session.currentUser.username});
});

router.get("/login", (req, res, next) => {
  res.render("signup", { type: "login", textButton: "Sign In"  });
});
router.get("/signup", (req, res, next) => {
  res.render("signup", { type: "signup", textButton: "Sign Up" });
});

router.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username.trim() === "" || password.trim() === "") {
    res.render("error", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }


  User.findOne({ "username": username }, (err, user) => {
    if (err || user !== null) {
      res.render("error", {
        errorMessage: "The username already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass,
    });

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
});


router.post("/login", (req, res, next) => {
  // req.session.destroy();
  console.log(req.session.currentUser);
  var username = req.body.username;
  var password = req.body.password;

  if (username.trim() === "" || password.trim() === "") {
    res.render("error", {
      errorMessage: "Indicate a username and a password to Sign In"
    });
    return;
  }

  User.findOne( { username: username }, (err, user ) => {
    if (err || !user) {
      res.render("error", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }

    if ( bcrypt.compareSync( password, user.password ) ) {
      req.session.currentUser = user;
      res.redirect('/main');
    } else {
      res.render('error', {
        errorMessage: 'Incorrect password',
      });
    }
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});

module.exports = router;
