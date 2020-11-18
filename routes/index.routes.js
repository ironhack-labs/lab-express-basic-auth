const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const salt = 10;
const app = require("../app");

const shouldBeAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.render("index", {
      errorMessage: "You are not authorized",
    });
  }
  next();
};

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

router.get("/main", shouldBeAuthenticated, (req, res) => {
  res.render("main");
});
router.get("/private", shouldBeAuthenticated, (req, res) => {
  res.render("private");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((foundUser) => {
      console.log("foundUser:", foundUser);
      if (foundUser) {
        res.render("signup", {
          errorMessage: "Either username or email is already taken",
        });
        //  warn either option is already taken
        return;
      }

      bcrypt
        .genSalt(salt)
        .then((generatedSalt) => {
          return bcrypt.hash(password, generatedSalt);
        })
        .then((hashedPassword) => {
          return User.create({
            username,
            password: hashedPassword,
          });
        })
        .then((userCreated) => {
          console.log("userCreated:", userCreated);
          req.session.user = userCreated;

          res.render("index", {
            generalMessage: "You just signed up and logged in",
          });
        });
    })
    .catch((err) => {
      console.log("err:", err);
      res.render("/signup", { errorMessage: err.message });
    });
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.render("index", {
      errorMessage: "You are already logged in, so log out to log in again",
    });
  }
  res.render("login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }).then((user) => {
    if (!user) {
      res.render("login", {
        errorMessage: "User does not exist",
      });

      return; //   error handle and say wrong username
    }
    console.log(user);
    bcrypt.compare(password, user.password).then((isSamePassword) => {
      if (!isSamePassword) {
        res.render("login", {
          errorMessage: "Password doesn't match",
        });

        return;
      }

      req.session.user = user;
      res.render("index", {
        generalMessage: "You are now logged in",
      });
    });
  });
});

// {{!-- added this to check if private and main worked  --}}
router.get("/logout", shouldBeAuthenticated, function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      res.render("index", {
        errorMessage: err,
      });
    }
    res.render("index", {
      generalMessage: "Succesfully logged out",
    });
  });
});

module.exports = router;
