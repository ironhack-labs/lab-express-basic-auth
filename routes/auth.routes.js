const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  if (!username || !password) {
    res.render('auth/signup', {
      errorMessage: 'Las informaciones username, y contraseña son mandatorias'
    });

    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {

    res.status(500).render('auth/signup', {
      errorMessage: 'La contraseña debe tener al menos 6 caracteres y debe contener, por lo menos, una letra minúscula, una mayúscula y un número.'
    });

    return;

  }

  bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        passwordHash: hashedPassword
      });
    }).then(userFromDB => {
      console.log('usuario creado: ', userFromDB.username);
      req.session.currentUser = userFromDB;
      console.log(userFromDB);
      res.redirect('/userProfile');
    })

    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render('auth/signup', {
          errorMessage: error.message
        });
      } else if (error.code === 11000) {
        res.status(400).render('auth/signup', {
          errorMessage: 'El username ya existe...'
        });
      } else {
        next(error);
      }
    });
});

router.get('/userProfile', (req, res) => {
  console.log(req.session.currentUser);
  console.log(req.session.cuentaCorriente);
  res.render('auth/user-profile', {
    user: req.session.currentUser
  });
});

router.get('/login', (req, res) => {
  console.log("la sesión existe?", req.session);
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }

  User.findOne({
      username
    })
    .then(userFromDB => {
      if (!userFromDB) {
        res.render('auth/login', {
          errorMessage: 'Username is not registered. Try with other username.'
        });
        return;
      } else if (bcrypt.compareSync(password, userFromDB.passwordHash)) {
        req.session.currentUser = userFromDB;
        res.redirect('/userProfile');
        //res.render('auth/user-profile', {
        //  userFromDB
        //});
      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect password.'
        });
      }
    })
    .catch(error => next(error));
});

router.get("/main", (req, res, next) => {
  console.log(req.session.currentUser);
  if (!req.session.currentUser) {
    res.render('auth/login', {
      errorMessage: 'User not logged in'
    });
  } else {
    res.render("auth/main");
  }
});

router.get("/private", (req, res, next) => {
  console.log(req.session.currentUser);
  if (!req.session.currentUser) {
    res.render('auth/login', {
      errorMessage: 'User not logged in'
    });
  } else {
    res.render("auth/private");
  }
});

router.post("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});




module.exports = router;