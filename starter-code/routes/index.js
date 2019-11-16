const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});







router.post('/signup', (req, res, next) => {

  function createUser() {
    const plainPassword = req.body.password;
    const user = req.body.user;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(plainPassword, salt)
  
    User.create({
      name: user,
      password: hash,
    }).then(userCreated => {
      console.log("The password is correct " + bcrypt.compareSync("1234", hash))
      res.render('success')
    });
  
  }

  mongoose
    .connect("mongodb://localhost/lablogin", { useNewUrlParser: true })
    .then(x => {
      console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
      createUser();
    })
    .catch(err => {
      console.error("Error connecting to mongo", err);
    });

});

router.post('/login', (req, res, next) => {

  function checkUser() {
    const user = req.body.user;
    const plainPassword = req.body.password;
  
    User.findOne({ name: user })
      .then(userFound => {
        if (bcrypt.compareSync(plainPassword, userFound.password)) {
          //continue login
          // req.session.currentUser = userFound._id;
          res.redirect("/private");
        } else {
          notFound("password or user are wrong");
        }
      })
      .catch(userNotFoundError => {
        notFound("user not found");
      });
  }
  





  mongoose
    .connect("mongodb://localhost/lablogin", { useNewUrlParser: true })
    .then(x => {
      console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
      checkUser();
    })
    .catch(err => {
      console.error("Error connecting to mongo", err);
    });

});







module.exports = router;
