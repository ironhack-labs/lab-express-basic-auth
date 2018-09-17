const express = require("express");
const router = express.Router();
const Login = require("../models/Login");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/singUp", (req, res, next) => {
  res.render("singUp");
});

router.post("/newUser", (req, res, next) => {
  const { user, password } = req.body;
  if (user === "" || password === "") {
    res.render("singUp", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
 
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  const newUser = new Login({ user, password: hashPass });
  newUser
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { user, password } = req.body;

  if (user === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }

  Login.findOne({ "user": user})
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error)
  })
});

module.exports = router;
