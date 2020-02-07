const express = require('express');
const router = express.Router();

const User = require("../models/user.models");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get('/signup', (req, res) => res.render('auth/signup'))
router.post('/signup', (req, res) => {

  const {
    email,
    password
  } = req.body
  let regular = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/

  if (email.length === 0 || password.length === 0 || !regular.test(password)) {
    res.render("auth/signup", {
      errorMessage: "METE LOS DATOS BIEN PAYASO! No estamos en el Oportiño"
    })
    return
  }

  User.findOne({
      email: email
    })
    .then(theExistingUser => {
      if (!theExistingUser) {

        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)

        User.create({
            email,
            password: hashPass
          })
          .then(() => res.redirect("/"))
          .catch(err => console.log(err))
      } else {
        res.render("auth/signup", {
          errorMessage: "¡NO VEAS CON EL ALZHEIMER!"
        })
        return
      }
    })
    .catch(err => console.log(err))


})


router.get('/login', (req, res) => res.render('auth/login'))
router.post("/login", (req, res) => {

  const {
    email,
    password
  } = req.body

  if (email.length === 0 || password.length === 0) {
    res.render("auth/login", {
      errorMessage: "PAYASO QUE TIENES QUE PONER ALGO"
    });
    return
  }

  User.findOne({
      email: email
    })
    .then(theUserFound => {
      if (!theUserFound) {
        res.render("auth/login", {
          errorMessage: "PRIMERO TENDRAS QUE REGISTRARTE PAYASO"
        });
        return
      }

      if (bcrypt.compareSync(password, theUserFound.password)) {
        req.session.currentUser = theUserFound;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "¿ESTAS INTENTANDO ROBARLE LA CONTRASEÑA A ALGUIEN?"
        })
      }
    })
    .catch(err => console.log(err))
})

module.exports = router;