const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.user });
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/main", (req, res, next) => {
  res.render("main", { user: req.session.user });
});

router.get("/private", (req, res, next) => {
  res.render("private", { user: req.session.user });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/");
  });
});

router.post("/signup", (req, res, next) => {
  console.log("User entered password and Username!");
  console.log("req.body: ", req.body);

  // need to retrieve username and password
  let { username, password } = req.body;
  console.log("username:", username, "password: ", password);

  // confirm all info was entered!
  if (!username || !password) {
    res.render("signup", {
      error: "Please make sure you've entered a username and a password!"
    });
    return;
  }

  // check if username already exists
  User.findOne({ username: username })
    .then(userDocument => {
      if (userDocument) {
        console.log(userDocument);
        res.render("signup", {
          error: "This username is already taken. Please try another one!"
        });
        return;
      }

      // encrypt password
      bcrypt.hash(password, 10, (err, hash) => {
        console.log(hash);
        // store user in database
        User.create({ username: username, password: hash })
          .then(userDocument => {
            console.log(
              "User was successfully created in database: ",
              userDocument
            );
            req.session.user = user;

            res.redirect("/");
          })
          .catch(err => console.log(err));
      });
    })
    .catch(err => console.log(err));
});

router.post("/login", (req, res, next) => {
  let { username, password } = req.body;
  console.log("session: ", req.session);
  console.log("username:", username, "password: ", password);

  let user;

  User.findOne({ username: username })
    .then(userDocument => {
      console.log(userDocument);
      if (!userDocument) {
        console.log("User not found!");
        res.render("login", {
          error: "Login failed. Please check username and password again!"
        });
        return;
      }

      user = userDocument;
      console.log(user);
      bcrypt.compare(password, user.password, (err, same) => {
        if (!same) {
          res.render("login", {
            error: "Login failed. Please check username and password again!"
          });
          return;
        }
        console.log("Logging in!");
        req.session.user = user;
        res.redirect("/");
      });
    })
    .catch(err => console.log(err));
  //get username and password entered
  //finde user with username (handle error if no user found!)
  //compare passwords
  //login if passwords match
});

module.exports = router;
