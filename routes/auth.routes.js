const router = require('express').Router()
const User = require('./../models/User.model')
const bcrypt = require('bcryptjs')

const saltRounds = 10

/* START Sign up form */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup-form')
})

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  console.log(req.body)

  //genero salt, recibe parametro, cuanto mayor mas dificil pero mas costo
  bcrypt
    .genSalt(saltRounds)
    // genero el hash con el string y el salt
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashPsw) => {
      // console.log(hashPsw)

      return User.create({ username, password: hashPsw })
    })
    .then(() => res.redirect('/dashboard'))
    .catch((err) => next(err))
})
/* END Sign up form */

// START Login Form
router.get('/login', (req, res, next) => {
  res.render('auth/login-form')
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body
  console.log(req.body)

  if (username.length === 0 || password.length === 0) {
    res.render('auth/login-form', {
      errorMessage: 'Complete los campos',
    })
    return
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render('auth/login-form', {
          errorMessage: 'No se encuentra el usuario',
        })
        return
      } else if (!bcrypt.compareSync(password, user.password)) {
        return res.render('auth/login-form', {
          errorMessage: 'Contraseña incorrecta',
        })
      } else {
        req.session.currentUser = user
        //console.log(req.session)
        res.redirect('/dashboard')
      }
    })
    .catch()
})

// END Login form

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})

module.exports = router
