const express = require("express");
const router = express.Router()
const User = require("../models/user");


const bcrypt = require("bcrypt");
const bcryptSalt = 10

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({
      "username": username
    })
    .then(dbresult => {
      if (dbresult !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      };

      if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a passeword to sign up"
        });
        return
      };

      User.create({
          username,
          password: hashPass
        })
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        })
    })
    .catch(error => {
      next(error);
    })

})

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please fill both fields"
    });
    return
  }

  User.findOne({ "username": theUsername })
    .then((dbresult) => {
      if (!dbresult) {
        res.render("aut/login", {
          errorMessage: "Sorry buddy, are you sure you have an account?"
        });
        return
      }
      if (bcrypt.compareSync(thePassword, dbresult.password)) {
        //save the login session
        req.session.currentUser = dbresult;
        res.redirect("/")
      } else {
        res.render("auth/login", {
          errorMessage: "Sorry buddy, are you sure you have an account?"
        });
      }
    })
    .catch((err) => {
      next(err)
    })
});

module.exports = router