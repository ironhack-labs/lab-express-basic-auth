const express = require('express');
const router = express.Router();
const Users = require("../models/Users");
const bcrypt = require("bcrypt");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/sign-up", (req, res, next) => {
  if (req.query.error) {
    if (req.query.error === "empty") {
      res.render("sign-up", {
        error: "The user or the password are empty :)"
      });
    }
    if (req.query.error == "user-exists") {
      res.render("sign-up", {
        error: "The user already exists :)"
      });
    }
  } else {
    res.render("sign-up")
  }
})

router.post("/sign-up", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
    res.redirect("/sign-up?error=empty");
  }

  Users.findOne({
    username: username
  }).then(foundUser => {
    if (foundUser === null) {
      const saltRounds = 5;

      const salt = bcrypt.genSaltSync(saltRounds);
      const encryptedPassword = bcrypt.hashSync(password, salt);

      Users.create({
        username: username,
        password: encryptedPassword
      }).then(
        createdUserData => {
          res.json({
            userCreated: true,
            createdUserData
          });
        }
      );
    } else {
      res.redirect("/sign-up?error=user-exists");
    }
  })
})

router.get("/login", (req, res, next) => {
  //res.render("login")
  if (req.query.error) {
    if(req.query.error === "empty"){
       res.render("login", {error: "username or password is empty"})
     }

      if(req.query.error === "user-not-exist"){
       res.render("login", {error: "username or password does not exist"})
     }

     if(req.query.error === "wrong-password"){
       res.render("login", {error: "username or password is wrong"})
     }

  }else{
    res.render("login")
  }
})

router.post("/login", (reg, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
    res.redirect("/login?error=empty");
  }

  Users.findOne({
    username: username
  }).then(foundUser => {
    if (foundUser === null) {
      res.redirect("/login?error=user-not-exist");
    } else {
      const bcrypt = require("bcrypt");
      const hashedPassword = foundUserData.password;
      if (bcrypt.compareSync(password, hashedPassword)) {
        req.session.user = foundUser._id;
        res.redirect("/home");
      } else {
        res.redirect("/login?error=wrong-password")
      }
    }
  })
})

module.exports = router;