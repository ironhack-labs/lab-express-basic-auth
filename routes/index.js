const router = require("express").Router()
const bcrypt = require('bcrypt')
const app = require('../app')

const User = require('./../models/User.model')

/* GET home page */
router.get("/", (req, res, next) => { res.render("index");});

router.get("/signup-page", (req, res) => res.render("auth/signup-page"))

router.post("/signup-page", (req,res) => {
  const { username, pwd } = req.body
  //res.send(req.body)

  User.findOne({ username})
  .then(user => {
    if(user) {
      res.render('auth/signup-page', {errorMessage: 'Usuario ya registrado'})
      return
    }

    const bcryptSalt = 10
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(pwd, salt)

    User
      .create({ username, password: hashPass})
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
})

router.get('/login-page', (req,res) => res.render('auth/login-page'))

router.post('/login-page', (req, res) => {
  const { username, pwd } = req.body
  //res.send(req.body)

  User
  .findOne({ username })
  .then(user => {
    if (!user) {
      res.render('auth/login-page', {errorMessage: 'Usuario Incorrecto' })
      return
    }

    if (bcrypt.compareSync(pwd, user.password) === false) {
      res.render('auth/login-page', {errorMessage: ' Contraseña Incorrecta' })
      return
    }
    req.session.currentUser = user
    res.redirect('/user-profile')
  })
  .catch(err => console.log(err))
})

router.get("/user-profile", (req, res, next) => { res.render("user/user-profile");});

router.use((req, res, next) => req.session.currentUser ? next() : res.render('auth/login-page', { errorMessage: 'Desautorizado' }))

router.get('/private', (req, res) => {
  const loggedUser = req.session.currentUser
  res.render('user/private', loggedUser)
})

router.get('/main', (req, res) => {
  const loggedUser = req.session.currentUser
  res.render('user/main', loggedUser)
})


module.exports = router;
