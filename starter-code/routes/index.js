const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');




const saltRounds = 5;



/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', (req, res, next) => {
  res.render('profile');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
console.log('entra en el post');
    User.findOne({ userName: req.body.user})
    .then(found => {
      console.log("xxxxxxx")
      console.log(found)
        const matches = bcrypt.compareSync(req.body.password, found.password)
        if (matches) {
          console.log('hay match');
            req.session.inSession = true
            req.session.user = req.body.user
            res.redirect('/profile')
        } else {
            req.session.inSession = false
            res.redirect('/')
        }
    })
    .catch();
  
});

router.post('/', (req, res, next) => {

  let bodyUser = req.body.user;
  let bodyPassword = req.body.password;

  if (bodyUser.length=== 0 || bodyPassword.length=== 0 ) {
    console.log("Ninguno de los campos puede estar vacio")
    return
  }
  
  User.username = req.body.user;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  User.password = hashedPassword;

  User.create({ userName: User.username, password: User.password })
    .then((x) => {
      console.log('Usuario creado');
      res.render('profile')
      
    },
      err => {
        console.log(`Error en login pringao ${err}`)
        next(err)
      });
});




module.exports = router;
