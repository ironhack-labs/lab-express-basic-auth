const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  var fieldsPromise = new Promise((resolve, reject) => {
    if (username === "" || password === "") {
      reject(new Error("Indicate a username and a password to sign up"));
    } else {
      resolve();
    }
  });

  fieldsPromise
    .then(() => {
      return User.findOne({ username });
    })
    .then(user => {
      if (user) {
        throw new Error("The username already exists");
      }

      // Hash the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      return newUser.save();
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", {
        errorMessage: err.message
      });
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  var fieldsPromise = new Promise((resolve, reject) => {
    if (username === "" || password === "") {
      reject(new Error("Indicate a username and a password to log in"));
    } else {
      resolve();
    }
  });

  fieldsPromise
    .then(() => {
      return User.findOne({ username });
    })
    .then(user => {
      if (!user) {
        throw new Error("The username not exists");
      }

      //  Check password hash is correct
      if (!bcrypt.compareSync(password, user.password)) {
        throw new Error("Incorrect Password");
      }
      // Save the login in the session!
      req.session.currentUser = user;
      console.log(`LOGGED AS USER ${user.username}`);
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/login", {
        errorMessage: err.message
      });
    });
});

router.get('/logout' , (req,res) => {
  req.session.currentUser = null;
  res.redirect('/');
})

module.exports = router;
