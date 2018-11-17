const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');




const saltRounds = 5;



/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

//SIGN UP
router.post('/', (req, res, next) => {

  let bodyUser = req.body.user;
  let bodyPassword = req.body.password;
  User.username = req.body.user;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  User.password = hashedPassword;

  //Campos vacios
  if (bodyUser === '' || bodyPassword === '') {
    res.render("signUpError", {
      errorMessage: "Ninguno de los campos debe estar empty"
    });
    return
  }

  //Usuario ya registrada
  User.findOne({ userName: req.body.user })
    .then(found => {
      res.render("signUpError", {
        errorMessage: "El usuario ya tiene cuenta"
      });
    })
    .catch(() => {
      User.create({ userName: User.username, password: User.password })
        .then((x) => {
          console.log('Usuario creado');
          res.redirect('/login');
        },
          err => {
            next(err)
            res.render("signup", {
              errorMessage: "Error al conectar con Mongo"
            });
            return;
          });
    });
});


//LOGIN
router.post('/login', (req, res, next) => {
  User.findOne({ userName: req.body.user })
    .then(found => {
      const matches = bcrypt.compareSync(req.body.password, found.password)
      if (matches) {
        req.session.inSession = true
        req.session.user = req.body.user
        res.redirect('/main')
      } else {
        req.session.inSession = false
        res.redirect('/')
      }
    })
    .catch();

});



router.get('/main', function (req, res) {
  if (req.session.inSession) {
    let sessionData = {
      ...req.session
    }
    res.render('main', {
      sessionData
    })
  } else {
    res.render('404')
  }
})

router.get('/private', function (req, res) {
  if (req.session.inSession) {
    let sessionData = {
      ...req.session
    }
    res.render('private', {
      sessionData
    })
  } else {
    res.render('404')
  }
})


module.exports = router;
