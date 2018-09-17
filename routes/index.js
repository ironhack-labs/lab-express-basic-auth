const express = require("express");
const router = express.Router();
const Login = require("../models/Login");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("index", {
      link: "Go to the Welcome Page",
      vip: "Go to the VIP ZONE"
    });
    return;
  }
  res.render("index");
});

router.get("/signUp", (req, res, next) => {
  res.render("signUp");
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
      errorMessage: "Indicate a username and a password valid to log in"
    });
    return;
  }

  Login.findOne({ "user": user})
  .then(user => {
    console.log(user)
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

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private", (req, res, next) => {
  res.render("private");
});

module.exports = router;
