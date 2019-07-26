const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const User = require('../models/user.model')

// Registro 
router.get("/signup", (req, res, next) => res.render("signup"))
router.post("/signup", (req, res, next) => {

  const { userName, password } = req.body

  // Validaciones: campos vacíos
  if (userName === "" || password === "") {
    res.render("signup", { errorMessage: "Rellena todos los campos" })
    return  // En caso de no pasar la validación, abandona la función sin crear el usuario ni el hash
  }


  // Validaciones: usuario duplicado
  User.findOne({ userName })
    .then(user => {
      if (user) {
        res.render("signup", { errorMessage: "El usuario ya existe" });
        return;
      }
    })
    .catch(err => console.log('ERRORR:', err))

  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  User.create({ userName, password: hashPass })
    .then(() => res.redirect('/'))
    .catch(err => console.log('ERRORR:', err))
})



// Iniciar sesión
router.get("/login", (req, res, next) => res.render("login"))
router.post("/login", (req, res, next) => {

  const { userName, password } = req.body

  if (userName === "" || password === "") {
    res.render("login", { errorMessage: "Rellena todo." });
    return;
  }

  User.findOne({ userName })
    .then(user => {
      if (!user) {
        res.render("login", { errorMessage: "El usuario no existe." })
        return
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user    // Guarda el usuario en la sesión actual
        res.redirect("/")
      } else {
        res.render("login", { errorMessage: "Contraseña incorrecta" })
      }
    })
    .catch(error => next(error))
})



// Cerrar sesión
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => res.redirect("/login"))
})



module.exports = router