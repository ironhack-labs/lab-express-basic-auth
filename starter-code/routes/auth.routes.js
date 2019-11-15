const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

// /* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index');
// });


const bcryptSalt = 10;

const User = require('../models/User.model')

router.get('/signup', (req, res) => res.render('auth/signup'));
router.post('/signup', (req, res) => {

  const {
    username,
    password
  } = req.body

  if (!username || !password) {
    res.render('auth/signup', {
      errorMessage: 'ERROR: Rellena los dos campos'
    })
    return
  }

  User.findOne({
      "username": username
    })
    .then(user => {
      if (user) {
        res.render("auth/signup", {
          errorMessage: "El nombre de usuario ya existe"
        })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
          username,
          password: hashPass
        })
        .then(() => res.redirect("/"))
        .catch(error => console.log(error))
    })
    .catch(error => {
      console.log(error)
    })
})



// Iniciar sesión: randerizar formulario
router.get("/login", (req, res, next) => res.render("auth/login"))


// Iniciar sesión: enviar formulario
router.post("/login", (req, res, next) => {

  const {
    username,
    password
  } = req.body

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Rellena ambos campos."
    })
    return
  }

  User.findOne({
      "username": username
    })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        })
        return
      }

      if (bcrypt.compareSync(password, user.password)) {

        req.session.currentUser = user; // El objeto request dispone de una propiedad .session donde guardar el .currenntUser
        res.redirect("/main");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        })
      }
    })
    .catch(error => console.log('error', error))
})




router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => res.redirect("/login"))
})



module.exports = router;