const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require(__dirname + "/../models/User.js");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const multer = require("multer");
const upload = multer({
  dest: __dirname + "/../public/images/files"
})

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/profileImg", upload.single("avatar"), (req, res, next) => {
  const userId = req.session.user._id;
  res.send(userId);

});


router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {

  const username = req.body.username;
  User.findOne({
      email: username
    })
    .then(user => {
      if (user) {
        res.render("register", {
          errorMessage: "The username already exists!"
        });
        return;
      } else {


        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          const newUser = new User({
            email: req.body.username,
            password: hash
          });
          newUser.save((err, user) => {
            if (err) {
              console.log(err);
            } else {
              debugger
              req.session.user = newUser
              res.redirect("/dogsPage");
            }
          });
        });

      }
    });



});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  debugger;
  let currentUser;
  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({
    email: username
  }).then(foundUser => {
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, function (err, result) {
        debugger

        // req.session.currentUser = foundUser;
        if (result) {
          debugger
          const session = req.session;
          session.user = foundUser;
          res.redirect("/dogsPage");
        } else {
          debugger

          res.redirect("/");
        }
      });

    } else {
      res.render("login", {
        errorMessage: "The username doesn't exist."
      });
      return;
    }
  }).catch(err => {
    console.log("err", err);
  });

});

const middleWare = require("./auth")

router.get("/dogsPage", middleWare, (req, res) => {


  User.findById(req.session.user._id)
    .populate("posts") // here mongoose also queries the posts collection
    .then(user => {
      res.render("dogsPage", {
        user: user
      });
    });

});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});


module.exports = router;