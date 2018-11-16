const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require("../models/user");
const app = express();
const MongoStore = require('connect-mongo')(session);



/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



router.post('/login', (req, res, next) => {
  User.findOne({
    user: req.body.user,
  }).then((found) => {
    const matches = bcrypt.compareSync(req.body.password, found.password);

    if (matches) {
      req.session.inSession = true;
      req.session.user = req.body.user;

      res.redirect('secret');
    } else {
      req.session.inSession = false;
      res.redirect('login');
    }
  });
});

router.get('/create', (req, res, next) => {
  res.render('create');
});

router.post('/create', (req, res) => {
  const saltRounds = 5;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  const newUser  = User({
    user: req.body.user,
    password: hashedPassword
  });

  newUser.save()
  .then(user => {
    res.redirect("/");
  })
  .catch(error => {
    console.log(error);
  })
});

module.exports = router;
