const express = require('express');
const router  = express.Router();
const User           = require("../models/user");
const mongoose     = require('mongoose');
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

router.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

/* GET home page */

router.get("/", (req, res, next) => {
  res.render("index");
});


router.get("/login", (req, res, next) => {
  const data = {
    action: "login"
  }
  res.render("login", data);
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      const isAuthorized = bcrypt.compareSync(thePassword, user.password);
      if (isAuthorized) {
        req.session.currentUser = user;
        res.render("index");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
    if (user !== null) {
      res.render("signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }

  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);    

  User.create({
    username,
    password: hashPass
  })
  .then(() => {
    res.redirect("login");
  })
  .catch(error => {
    console.log(error);
  })
  })

  .catch(error => {
    next(error);
  })

});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {                    
    res.redirect("login");         
  }                                 
}); 

router.get("/private", (req, res, next) => {

  res.render("private");
});


module.exports = router;
