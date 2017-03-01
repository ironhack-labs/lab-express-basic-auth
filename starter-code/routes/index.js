const express = require('express');
const router = express.Router();
const User = require('../models/user-model.js');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) =>{
  res.render('index.ejs', {
    errorMessage: null
  });
});

router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render('index', {
      errorMessage: "Please fill in both fields before submitting"
    });
    return;
  }

  User.findOne({username: username}, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }

    if (!foundUser) {
      res.render('index', {
        errorMessage: "Username does not exist"
      });
      return;
    }

    if(bcrypt.compareSync(password, foundUser.password)) {
      req.session.currentUser = foundUser;
      res.redirect('index');
    } else {
      res.render('index', {
        errorMessage: "Incorrect password"
      });
      return;
    }

  });


});

module.exports = router;
