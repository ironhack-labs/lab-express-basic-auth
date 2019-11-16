const express = require('express');
const router = express.Router();
const Users = require("../models/User");
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({
  extended: true
}));

/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/signup', (req, res, next) => {
  Users.findOne({
      name: req.body.username
    })
    .then(userFound => {
      if (userFound === null) {
        Users.create({
            name: req.body.username,
            password: req.body.password
          })
          .then(createdUser => {
            res.json({
              created: true,
              createdUser
            })
          })
          .catch(() => {
            res.json({
              created: false
            })
          })
      } else {
        res.json({
          authorised: false,
          reason: 'User already exists'
        })
      }
    })
});


module.exports = router;