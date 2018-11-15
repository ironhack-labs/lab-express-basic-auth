const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;



router.get("/signup", (req, res, next) => {
  res.render("signUpHBS");
});


router.post('/signup', (req, res, next) => {


  const theUserName = req.body.theUserName;
  const thePassWord = req.body.thePassWord;

  if (theUserName === "" || thePassWord === "") {
    res.render("signup", { errorMessage: "Indicate a username and a password to sign up" });
    return;
  }


  User.findOne({ username: theUserName })
    .then(user => {
      if (user !== null) {
        res.render("signup", {
          errorMessage: "Sorry, that username is awesome so obviously it's taken!"
        });
        return;
      }



      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(thePassWord, salt);


      User.create({ username: theUserName, password: hashPass })
        .then(() => {
          res.redirect('/');
        })
        .catch((err) => {
          next(err);
        })


    });// end .then for User.findOne
});



router.get('/login', (req, res, next) => {
  res.render('logInHBS');
});


router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;


  if (username === "" || password === "") {
    res.render("logInHBS", { errorMessage: "Indicate a username and a password to sign up" });
    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        res.render("logInHBS", { errorMessage: "Sorry, that username doesn't exist" });
        return;
      }

      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("logInHBS", {
          errorMessage: "Incorrect password"
        });
      }

    })
    .catch(error => {
      next(error)
    })
});



router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/signup");
  });

});




module.exports = router;
