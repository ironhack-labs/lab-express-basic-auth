const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require('../models/User.model.js')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
    const { username, password } = req.body;
    

  // form validation
  if (username.length === 0 || password.length === 0) {
    res.render("auth/signup", { errorMsg: "Rellena los campos" });
    return;
  }

  if (password.length < 2) {
    res.render("auth/signup", { errorMsg: "La contraseña es corta" });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

    User
    .create({ username, password: hashPass })
    .then((theUserCreated) => {
      console.log("Se ha creado el usuario registrado", theUserCreated);
      res.redirect("/");
    })
      .catch((err) => console.log("Error", err));
    
});



router.get('/login', (req, res) => { 
    
    res.render("auth/login")

    })

router.post('/login', (req, res) => {

    const { username, password } = req.body

   if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMsg: 'Rellena los campos' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {

            if (!theUser) {
                res.render('auth/login', { errorMsg: 'Usuario no reconocido' })
                return
            }

            if (bcrypt.compareSync(password, theUser.password)) {

                req.session.currentUser = theUser
                console.log('El usuario con sesión inciada es:', req.session.currentUser)
                res.redirect('/')

            } else {

                res.render('auth/login', { errorMsg: 'Contraseña incorrecta' })
                return
            }
        })
})


router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect("/login"))
})


router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render("auth/login", {
            errorMsg: 'Please, Log-in'
        })
    }
})


router.get("/main", (req, res) => {
    res.render('auth/main', req.session.currentUser)
});

router.get("/private", (req, res) => {
    res.render('auth/private', req.session.currentUser)
});









module.exports = router;
