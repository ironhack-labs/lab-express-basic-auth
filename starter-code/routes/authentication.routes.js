const express = require('express');
const router  = express.Router();

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10



router.get('/signup', (req, res, next) => {
  res.render('authentication/signup');
});

router.post('/signup',(req, res, next) =>{

  const { email, password } = req.body

  if (email.length === 0 || password.length === 0 ) {
    res.render("authentication/signup", { errorMessage: "Rellena los datos" })
    return
  }

  User.findOne({email: email})
    .then(userFound => { 
      if (!userFound){
        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)

        User.create({ email, password: hashPass })
          .then(newUser => res.redirect("/"))
          .catch(err => console.log(err))
      }
      else {
        res.render("authentication/signup", { errorMessage: "Email ya resgitrado, ¡qué calvario!" })
        return
      } 
    })




router.get('/login', (req, res, next) => {
res.render('authentication/login');
});

// router.post('/login',(req, res, next) =>{

//   const { email, password } = req.body

//   if (email.length === 0 || password.length === 0 ) {
//     res.render("authentication/login", { errorMessage: "Por favor introduce los datos en el campo vacío" })
//     return
//   }

//   User.findOne({email: email})
//     .then(userFound =>{
//       if (!userFound){
//         res.render("authentication/login", {errorMessage: "Email no registrado"})
//         return
//       }

//       if (bcrypt.compareSync(password, userFound.password)) {
//         req.session.currentUser = userFound;
//         res.redirect("/");
//       } else {
//         res.render("auth/login", { errorMessage: "Contraseña incorrecta" })
//       }
//     })





})

module.exports = router;
