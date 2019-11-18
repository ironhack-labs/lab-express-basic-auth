const express = require("express");
const router = express.Router();
const Users = require("../models/User");
const bcrypt = require("bcrypt");


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/signup", (req, res, next) => {

  function createUser() {
    const plainPassword = req.body.password;
    const username = req.body.username;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(plainPassword, salt)
  
    User.create({
      name: username,
      password: hash,
    }).then(() => {
      console.log("The password is correct " + bcrypt.compareSync("1234", hash))
      res.render('success')
    });
  
  }

});

router.post("/login", (req, res, next) => {
  Users.findOne({
    name: req.body.username
  })
    .then(userFound => {
      if (bcrypt.compareSync(req.body.password, userFound.password)) {
        req.session.currentUser = userFound._id;
        res.redirect("/private");
      } else {
    res.redirect("/not-found");
      }
    })
    .catch(() => {
  res.redirect("/not-found");
    });
});

router.get("/private", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("private");
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("main");
  } else {
    res.redirect("/login");
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
