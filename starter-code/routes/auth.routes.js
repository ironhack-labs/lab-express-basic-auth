const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const User = require('../models/user.model')


//registrar nuevo usuario
router.get('/signup', (req, res, next)=> res.render('signup'))

router.post("/signup", (req, res, next) => {

  const { user, password } = req.body
  if (user === "" || password === ""){
    res.render("signup",{errorMsg: "Rellena todos los campos"})
    return
  }

const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass = bcrypt.hashSync(password, salt)

User.findOne({user})
  .then(us => {
    if (us){
      res.render('signup', {errorMsg: `Este usuario ya existe.`})
      return
    }
  })
  .catch(err => console.log('Error, algo va mal', err))

User.create({user, password: hashPass})
  .then(() => res.redirect('/'))
  .catch(err => console.log('Error, algo va mal', err))
})


//inicio de sesion
router.get('/login',(req, res, next) => res.render('login'))
router.post('/login',(req, res, next) => {

  const {user, password} = req.body

  if (user === "" || password === ""){
    res.render("login",{errorMsg: "Rellena todos los campos"})
    return
  }
  User.findOne({user})
    .then(user => {
      if(!user){
        res.render('login', {errorMsg: "Usuario incorrecto"})
        return
      }
      if (bcrypt.compareSync(password, user.password)){
        req.session.currentUser = user
        res.redirect("/main")
      }
      else {
        res.render("login", {errorMsg: "Contrasena incorrecta"})
      }
      
    })
    .catch(error => next(error))
})

//cerrar la sesion
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => res.redirect('/login'))
})



module.exports = router;

