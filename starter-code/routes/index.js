const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const isAuthenticated = require('../helpers/authMiddleware');

const User = require('../models/user');

/* GET home page */
router.get('/', (req, res, next) => {
  if (req.session.currentUser) res.render('index', { currentUser: req.session.currentUser });
  res.render('index');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/private', isAuthenticated, (req, res, next) => {
  res.render('private');
});

router.post('/register', (req, res, next) => {
  const {username, password} = req.body;
  if (!username || !password) res.render('register', { error: 'No has rellenado todos los campos' });

  User.findOne({ username })
    .then( user => {
      if (user) res.render('register', { error: 'El usuario ya existe' });
      const salt  = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      return new User({username, password: hash}).save();
    })
    .then(response=> res.render('/login'))
    .catch( error => console.log(error))
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  if (!username || !password) res.render('login', { error: 'No has rellenado todos los campos' });

  User.findOne({ username })
    .then(user => {
      if (!user) res.render('login', { error: 'Usuario o contraseña incorrectos' });

      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("/login", {error: 'Usuario o contraseña incorrectos'});
      }
    })
    .catch(error => console.log(error));

});

module.exports = router;
