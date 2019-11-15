const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt')

const bcryptSalt = 10;
const User = require('../models/User.models')


/* GET home page */

router.get('/signup', (req, res) => res.render('auth/signUp'));
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
    
    if (password.length < 8){
      res.render('auth/signup', {
        errorMessage: 'ERROR: la contraseña es muy corta'
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


//LOG IN

router.get('/login', (req, res) => res.render('auth/logIn'));
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
          errorMessage: "El nombre de Usuraio no existe."
        })
        return
      }

      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user; // El objeto request dispone de una propiedad .session donde guardar el .currenntUser
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Contraseña Incorrecta"
        })
      }
    })
    .catch(error => console.log('error', error))
})

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => res.redirect("/login"));
});

router.use((req, res, next) => {
  req.session.currentUser ? next() : res.redirect("/login")
})

router.get('/', (req, res, next) => res.render('index',{
  user: req.session.currentUser
}));

router.get('/private', (req, res) => res.render('auth/privatePage', {
  user: req.session.currentUser
}));

module.exports = router;
