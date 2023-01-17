const router = require("express").Router();
// const { genSalt } = require("bcrypt")
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;
const mongoose = require("mongoose");

router.get("/signup", (req, res) => {
  console.log(req.session);
  data = { userInSession: req.session };
  res.render("login/signup", data);
});

router.get("/login", (req, res) => {
  res.render("login/login");
});

// router.get('/mainpage', (req, res, next) => {
//   res.render('mainpage')
// })
// router.get('/private', (req, res, next) => {
//   res.render('private')
// })

router.post("/signup", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      return User.create({
        username: username,
        encryptedPassword: hashedPassword,
      });
    })
    .then(res.redirect("/"))

    // .then(newUser => {
    //   console.log("newUser: ", newUser)
    //   if (email && password) {
    //     console.log("move to main page")
    //     res.redirect("/mainpage")
    //   }
    // })

    .catch((error) => {
      console.log(error);
    });
});

router.post("/login", (req, res) => {
  console.log("SESSION =====>", req.session);

  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/login", {
      errorMessage: "please enter an email or password",
    });
    return;
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage:
            "User not found please sign up. No account associated with email",
        });
      } else if (bcrypt.compareSync(password, user.encryptedPassword)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect Password" });
      }
    })

    .then(res.redirect("/"))

    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
