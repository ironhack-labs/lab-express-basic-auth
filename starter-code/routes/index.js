const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require("../Models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  const user = req.body; // req.body contains the submited informations (out of post request)

  if (!user.username || !user.password) {
    res.redirect("/");
    return;

  } else {

    userModel
      .findOne({
        username: user.username
      })
      .then(dbRes => {
        if (dbRes) { // si les usernames et passwords sont déjà dans la db ...
          res.redirect("/"); // ... alors tu restes sur la home page
          return;
        }
        const salt = bcrypt.genSaltSync(10); // cryptography librairie
        const hashed = bcrypt.hashSync(user.password, salt);
        console.log("original", user.password);
        user.password = hashed;

        userModel
          .create(user)
          .then(() => res.redirect("/")) // which page ???
          .catch(dbErr => console.log("user not created", dbErr));
      })
      .catch(dbErr => {
        next(dbErr);
        console.log("don't find the username/password");
      });
  }
});

module.exports = router;