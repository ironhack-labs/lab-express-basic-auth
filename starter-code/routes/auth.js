const express = require('express');
const router  = express.Router();
const User = require("../models/user");
const zxcvbn = require('zxcvbn');

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
})

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  if (password.length < 8) {
    res.render("auth/signup", { username, password,
      errorMessage: "Password must be at least 8 characters."
    });
    return;
  }
  
  let { feedback: { suggestions } } = zxcvbn(password);
  console.log(zxcvbn(password));
  if (suggestions.length > 0) {
    res.render("auth/signup", { username, password, errorMessage: suggestions.reduce((acc, val) => acc += val + '\n', "") });
    return;
  }

  User.findOne({ "username": username }).then(user => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "Username already exists!"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({ username, password: hashPass })
    .then(() => {
      res.render("auth/login", { message: "Account created! Please login using your credentials"});

    }).catch(error => {
      console.log(error);
      next(error);
    });
  })
  .catch(error => {
    next(error);
  })
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both username and password to login."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Invalid credentials"
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/main');
      } else {
        res.render("auth/login", {
          errorMessage: "Invalid credentials"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next();
  } else {
    res.redirect("/login");         
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // can't access session here
    res.redirect("/login");
  });
});

module.exports = router;
