const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

router.get("/signup", (req, res) => res.render("auth/signup"));

const saltRounds = 10;

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/userProfile");
    })
    .catch(error => {
      if (error.code === 11000) {
          res.status(500).render('auth/signup', {
              errorMessage: 'Username needs to be unique. Username is already used.'
          });
      } else {
          next(error);
      }
  });
})


router.get("/userProfile", (req, res) => res.render("users/user-profile"));

module.exports = router;
