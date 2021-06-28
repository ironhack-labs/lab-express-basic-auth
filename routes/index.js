const router = require("express").Router();
const bcrypt = require('bcrypt')
const app = require("../app")

const User = require('./../models/User.model')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//Singup Merluzo

router.get('/singup', (req, res) => res.render('auth/singup-page'))
router.post('/singup', (req, res) => {

  const { username, passwordText } = req.body

  User
    .findOne({ username })
    .then(user => {

      if (user) {
        res.render('auth/singup-page', { errorMessage: 'Usuario ya registrado' })
        return
      }

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(passwordText, salt)

      User
        .create({ username, password: hashPass })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
})


// Login supermerluzo

router.get('/login', (req, res) => res.render('auth/login-page'))

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
      res.redirect('/')
    })
    .catch(err => console.log(err))
})






module.exports = router;
