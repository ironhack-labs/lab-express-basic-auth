const router = require("express").Router();
const bcrypt = require('bcrypt')
const app = require("../app")

const User = require('./../models/User.model')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Signup
router.get('/registro', (req, res) => res.render('auth/signup-page'))

router.post('/registro', (req, res) => {

  const { username, pwd } = req.body

  User
    .findOne({ username })
    .then(user => {

      if (user) {
        res.render('auth/signup-page', { errorMessage: 'Usuario ya registrado' })
        return
      }

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(pwd, salt)

      User
        .create({ username, password: hashPass })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
})

// Login
router.get('/inicio-sesion', (req, res) => res.render('auth/login-page'))

router.post('/inicio-sesion', (req, res) => {

  const { username, pwd } = req.body

  User
    .findOne({ username })
    .then(user => {

      if (!user) {
        res.render('auth/login-page', { errorMessage: 'Usuario no reconocido' })
        return
      }

      if (bcrypt.compareSync(pwd, user.password) === false) {
        res.render('auth/login-page', { errorMessage: 'Contraseña incorrecta' })
        return
      }

      req.session.currentUser = user      // Iniciar sesión = almacenar el usuario logueado en req.session.currentUser
      res.redirect('/mi-perfil')
    })
    .catch(err => console.log(err))
})



router.get('/desconectar', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})

// MIDDLEWARE DETECTOR DE SESIÓN
router.use((req, res, next) => req.session.currentUser ? next() : res.render('auth/login-page', { errorMessage: 'Desautorizado' }))


// RUTAS PROTEGIDAS
router.get('/mi-perfil', (req, res) => {
  const loggedUser = req.session.currentUser
  res.render('user/user-profile', loggedUser)
})

module.exports = router;