const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const User = require('../models/user');

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    let error = 'Usuario y/o contraseña no pueden estar vacíos.';
    res.render('auth/signup', { error });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);

          const newUser = {
            username,
            password: hashPass,
          };

          User.create(newUser)
            .then((result) => {
               res.redirect('/');
            })
            .catch((err) => {
              let error = 'Error en el servidor al crear el usuario.';
              res.render('auth/signup', { error }); 
            })
        } else {
          let error = 'Este usuario ya existe';
          res.render('auth/signup', { error });
        }
      })
      .catch((err) => {
        next(err);
      }) 
  }
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    let error = 'Usuario y/o password no pueden estar vacíos.';
    res.render('auth/login', { error });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          let error = 'Usuario y/o password incorrectos.';
          res.render('auth/login', { error });
        } else if ( bcrypt.compare(password, user.password) ) {
          req.session.currentUser = user._id;
          res.render('user/profile', { user });
        } else {
          let error = 'Usuario y/o password incorrectos.';
          res.render('auth/login', { error });
        }
      })
  }
});

module.exports = router;