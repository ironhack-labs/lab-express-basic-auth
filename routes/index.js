const router = require("express").Router();
const bcrypt = require('bcryptjs');
const User = require('./../models/User.model');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', (req, res) => {
  res.render('signup-form');
})

router.post('/signup', (req, res) => {
  const { username, pwd } = req.body
  
  // If username is empty
  if (username.length === 0) {
    res.render('signup-form', { errorMsg: 'El nombre de usuario es obligatorio' })
    return
  }

  // If password is empty
  if (pwd.length === 0) {
    res.render('signup-form', { errorMsg: 'La contraseña es obligatoria' })
    return
  }

  // If username and password are introduced
  User
    .findOne({username})
    .then(user => {

      if (user) {
        res.render('signup-form', { errorMsg: 'El nombre de usuario ya está registrado' })
        return
      }

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(pwd, salt)

      User
        .create({ username, password: hashPass })
        .then(() => res.redirect('/'))  //MODIFICAR AUTENTICACIÓN
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
})

router.get('/login', (req, res) => {
  res.render('login-form');
})

router.post('/login', (req, res) => {
  const { username, pwd } = req.body
  
  // Check user introduces username and password
  if (username.length === 0 || pwd.length === 0) {
    res.render('login-form', { errorMsg: 'Usuario y contraseña obligatorios' })
    return
  }

  User
  .findOne({username})
  .then(user => {

    if (!user) {
      res.render('login-form', { errorMsg: 'El nombre de usuario no existe' })
      return
    }

    if (!bcrypt.compareSync(pwd, user.password)) {
      res.render('login-form', { errorMsg: 'Contraseña incorrecta' })
      return
    }

    req.session.currentUser = user
    res.redirect('/') //MODIFICAR AUTENTICACIÓN

  })
  .catch(err => console.log(err))
})

router.get('/end-session', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})

// Middleware
router.use((req, res, next) => {
  req.session.currentUser ? next() : res.render('login-form', { errorMsg: 'Desautorizado' })
})

router.get('/main', (req, res) => {
  res.render('main-page', { user: req.session.currentUser })
})

router.get('/private', (req, res) => {
  res.render('private-page', { user: req.session.currentUser })
})


module.exports = router;
