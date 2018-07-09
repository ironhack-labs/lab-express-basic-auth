const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

function isAuthenticated(req, res, next) {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/login');
  }
}

function isLoggedIn(req, res, next) {
  if (req.session.currentUser) {
    res.redirect('/private')
  } else {
    next();
  }
}
router.get('/private', isAuthenticated, (req, res) => {
  res.render('private')
})

router.get('/login', (req, res) => {
  res.render("auth/login")
});

router.get('/main', isAuthenticated, (req, res) => {
  res.render('main')
})

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        req.body.error = "Este usuario no existe";
        return res.render('auth/login', req.body)
      }
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/private');
      } else {
        req.body.error = "La contrasena no es correcto";
        return res.render('auth/lgon', req.body)
      }
    })
    .catch(err => next(e))
});

router.post('/signup', (req, res, next) => {
  if (req.body.password !== req.body.password2) {
    req.body.error = 'escribe bien la contra';
    return res.render('auth/signup', { error: "escribe bien" })
  }
  const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  req.body.password = hash;
  User.create(req.body)
    .then(user => res.send(user))
    .catch(e => next(e))
})


module.exports = router;