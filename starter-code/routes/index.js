const express = require('express');
const router = express.Router();
const userSchema = require("../models/user");
const checkFields = require("../src/js/fieldsVerification")
const encriptPassword = require("../src/js/bcrypt")


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render("signup")
});

router.post("/signup", (req, res, next) => {
  if (req.body.username === "" || req.body.password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    })
  } else if (checkFields(req.body.username)) {
    res.render("signup", {
      errorMessage: "The username already exists!"
    })
  } else {
    userSchema
      .create({ username: req.body.username, password: encriptPassword(req.body.password) })
      .then(done => {
        console.log(done)
      })
      .catch(err => console.log("An error ocurred:", err))
  }
})

module.exports = router;
