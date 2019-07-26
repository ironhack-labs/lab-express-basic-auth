const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const User = require('../model/user.model')


// Registro 
router.get("/signup", (req, res, next) => res.render("signup"))
router.post("/signup", (req, res, next) => {

  const { username, password } = req.body

  // Validaciones: campos vacíos
  if (username === "" || password === "") {
    res.render("signup", { errorMessage: "Rellena todo" })
    return  // En caso de no pasar la validación, abandona la función sin crear el usuario ni el hash
  }


  // Validaciones: email duplicado
  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("signup", { errorMessage: "El email ya existe, merluzo" });
        return;
      }
    })
    .catch(err => console.log('ERRORR:', err))

  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  User.create({ username, password: hashPass })
    .then(() => res.redirect('/'))
    .catch(err => console.log('ERRORR:', err))
})



// Iniciar sesión
router.get("/login", (req, res, next) => res.render("login"))
router.post("/login", (req, res, next) => {

  const { username, password } = req.body

  if (username === "" || password === "") {
    res.render("login", { errorMessage: "Rellena todo." });
    return;
  }

  User.findOne({ username })
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



module.exports = router;