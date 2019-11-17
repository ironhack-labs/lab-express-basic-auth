const express = require('express');
const router  = express.Router();
const bcrypt       = require("bcrypt");
const User         = require("../models/user");
const bcryptSalt   = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});



router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  // const salt     = bcrypt.genSaltSync(bcryptSalt);
  // const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ "username": username })
  .then(user => {
    if (user !== null) {
        res.render("signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }
  
      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
  
      User.create({
        username,
        password: hashPass
      })
      .then(() => {
        res.render ("signup",{createUser: "Cuenta de Usuario creada"})
        // res.redirect("/");
      })
      .catch(error => {
        console.log(error);
      })
  })
  .catch(error => {
    next(error);
  })
});

module.exports = router;
