const express = require('express');
const router = express.Router();
const User = require('../models/user')
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);



router.get('/', (req, res, next) => {
  if (req.session.currentUser) {

    res.redirect('/main')
  } else {
    res.redirect('/login')

  }

});
router.get('/login', (req, res, next) => {
  res.render('login');
});
router.get('/sign', (req, res, next) => {
  res.render('sign');
});
router.post('/sign', (req, res, next) => {
  const { user, pass
  } = req.body;

  if (user === "" || pass === "") {
    res.render('sign', { error: "Campos vacios" });
  } else {

    User.findOne({ username: user }).then((userdata) => {

      if (userdata) {
        res.render('sign', { error: "Usuario no disponible" });
      } else {

        User.insertMany({ username: user, password: pass }).then(() => {

          res.render('login', { error: "Registro completado, inicia sesion" })
        })
      }
    })
  }
});
router.post('/login', (req, res, next) => {
  const { user, pass
  } = req.body;

  if (user === "" || pass === "") {
    res.render('login', { error: "Campos vacios" });
  } else {

    User.findOne({ username: user, password: pass }).then((datalogin) => {

      if (datalogin) {
        req.session.currentUser = datalogin;
        res.redirect('/main')
      } else {

        res.render('login', { error: "Error al introducir datos" })
      }

    })
  }
});

router.get('/main', (req, res, next) => {
  console.log(req.session)
  res.render('home');

});
router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {

    res.redirect('/');

  })
});

module.exports = router;
