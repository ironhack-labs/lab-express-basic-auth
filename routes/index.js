
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { isLoggedOut, isLoggedIn } = require('../middlewares/route-guard');

const saltRounds = 10

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


//Rutas para registro
router.get('/registrarse', (req, res) => {
  res.render('auth/signup')
})


router.post('/', (req, res, next) => {

  const { username, plainPassword } = req.body

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(plainPassword, salt))
    .then(hash => User.create({ username, password: hash }))
    .then(() => res.redirect('/main'))
    .catch(err => next(err))
})


//Rutas para iniciar sesión

router.get('/acceder', (req, res, next) => {
  res.render('auth/login')
})


router.post('/acceder', (req, res, next) => {

  const { username, password } = req.body
  console.log("datos del login", username, password)
  if (username.length === 0 || password.length === 0) {
    res.render('auth/login', { errorMessage: "Faltan campos que rellenar" })
    return
  }

  User
    .findOne({ username })
    .then(foundUser => {

      if (!foundUser) {
        res.render('auth/login', { errorMessage: 'Usuario inexistente' })
        return
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
        return
      }

      req.session.currentUser = foundUser
      res.redirect('/private')
    })
    .catch(err => next(err))

})


//para ir al main
router.get('/main', (req, res) => {
  res.render('auth/main')
})


//cerrar sesión
router.get('/cerrar-sesion', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})

console.log(isLoggedIn)
router.get("/private", isLoggedIn, (req, res) => {


  res.render("auth/profile", { loggedUser: req.session.currentUser });
})



module.exports = router;
