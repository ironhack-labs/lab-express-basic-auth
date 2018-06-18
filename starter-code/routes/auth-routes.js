const express   = require('express');
const bcrypt    = require('bcrypt');
const User      = require('../models/user')

const authRoutes  = express.Router();

// get to signup page
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

const bcryptSalt = 10;

// get data from the signup page
authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if ( username === "" || password === "" ) {
    res.render('auth/signup', {
      errorMessage: "Every account needs a username and a password. Submit a username and a password."
    });
    return;
  }

  User.findOne( { username: username } )
    .then( user => {
      if (user !== null) {
        res.render('auth/signup', {
          errorMessage: "The username you chose is already in the database. Try another one."
        })
      return;
      }
    })
    .catch( err => { throw err } );

  const newUser  = User({
    username,
    password: hashPass
  });

  newUser.save()
  .then(user => {
    res.redirect("/");
  })
});

// get to login page
authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// get data from the login page
authRoutes.post("/login", (req, res, next) => {
  let { username, password } = req.body;

  if ( username === "" || password === "" ) {
    res.render('auth/login', {
      errorMessage: "Insert your username and password if you want to login."
    });
    return;
  }

  User.findOne( { username: username } )
    .then( user => {
      // if no account already
      if (!user) {
        res.render('auth/signup', {
          errorMessage: "User do not exist"
        })
      return;
      }

      // if user exists check password
      if ( bcrypt.compareSync(password, user.password) ) {
        req.session.currentUser = user;
        res.redirect('home');
      } else {
        res.render('auth/login', {
          errorMessage: "Password incorrect."
        })
      }
    })
    .catch( err => { throw err } );
});

module.exports = authRoutes;
