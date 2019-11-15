const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

const bcryptSalt = 10;

const User = require('../models/User.model')

router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', (req, res) => {

  const {
    username,
    password
  } = req.body

  if (!username || !password) {
    res.render('signup', {
      errorMessage: 'ERROR: Rellena los dos campos'
    })
    return
  }

  User.findOne({
      "username": username
    })
    .then(user => {
      if (user) {
        res.render("signup", {
          errorMessage: "El nombre de usuario ya existe"
        })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      // forms[0].onsubmit = e => {
      //   e.preventDefault()
      //   const inputValue = e.target[1].value
      if (password.match(/[0-9]/) && password.match(/[A-Z]/) && password.match(/[a-z]/) && password.match(/[!$*]/) && password.length >= 6) {
        //     
        User.create({
            username,
            password: hashPass
          })
          .then(() => {
            console.log("el usuario: ", username, "la password: ", password)
            res.redirect("/")
          })
          .catch(error => console.log(error))

      } else {
        res.render("signup", {
          errorMessage: "la password no cumple las puñeteras reglas de contraseña"
        })
      }

      //}


    })
    .catch(error => {
      console.log(error)
    })
})



// Iniciar sesión: randerizar formulario
router.get("/login", (req, res, next) => res.render("login"))


// Iniciar sesión: enviar formulario
router.post("/login", (req, res, next) => {

  const {
    username,
    password
  } = req.body

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Rellena ambos campos."
    })
    return
  }

  User.findOne({
      "username": username
    })
    .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "El usuario no existe."
        })
        return
      }

      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user; // El objeto request dispone de una propiedad .session donde guardar el .currenntUser
        res.redirect("/");
        console.log("el usuario: ", req.session.currentUser)

      } else {
        res.render("login", {
          errorMessage: "contraseña incorrecta"
        })
      }
    })
    .catch(error => console.log('error', error))
})


/*

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => res.redirect("/login"));
});
*/
module.exports = router