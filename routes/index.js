const router = require("express").Router();
const bcrypt = require('bcrypt')
const User = require('./../models/User.model')
const app = require("../app")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/registro', (req, res) => {
  res.render("registro")
})

router.post('/registro', (req, res) => {
  const { username, password } = req.body
  const bcryptSalt = 10
  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  User
    .create({ username: username, password: hashPass })
    .then((user) => res.redirect("/login"))
    .catch(err => console.log(err))



})

router.get('/login', (req, res) => {
  res.render("login")

})

router.post('/login', (req, res) => {

  const { username, password } = req.body

  User.findOne({ username })
    .then(user => {
      if (bcrypt.compareSync(password, user.password) === false) {
        res.render('auth/login-page', { errorMessage: 'Contraseña incorrecta' })
        return
      } else {
        req.session.currentUser = user
        res.render("perfil")
      }
    })

})

router.get("/perfil", (res, req) => {
  res.send("hola")

})




module.exports = router;
