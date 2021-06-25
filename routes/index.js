const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


// Signup
router.get('/registro', (req, res) => res.render('../views/sign-up'))

router.post('/registro', (req, res) => {

  const { username, password } = req.body

  User
    .findOne({ username })
    .then(user => {

      if (user) {
        res.render('../views/sign-up', { errorMessage: 'Usuario ya registrado' })
        return
      }

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User
        .create({ username, password: hashPass })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
})


// Login
router.get('/inicio-sesion', (req, res) => res.render('./../views/log-in'))

router.post('/inicio-sesion', (req, res) => {

  const { username, password } = req.body

  User
    .findOne({ username })
    .then(user => {

      if (!user) {
        res.render('./../views/log-in', { errorMessage: 'Usuario no reconocido' })
        return
      }

      if (bcrypt.compareSync(password, user.password) === false) {
        res.render('./../views/log-in', { errorMessage: 'Contraseña incorrecta' })
        return
      }

      req.session.currentUser = user      // Iniciar sesión = almacenar el usuario logueado en req.session.currentUser
      res.redirect('./../views/index')
    })
    .catch(err => console.log(err))
})



router.get('/desconectar', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})

router.use((req, res, next) => req.session.currentUser ? next() : res.render('./../views/log-in',
 { errorMessage: 'Desautorizado' }))
  // RUTAS PROTEGIDAS
  router.get('/mi-perfil', (req, res) => {
      const loggedUser = req.session.currentUser 
       res.render('./../views/user-profile', loggedUser)})
module.exports = router;
