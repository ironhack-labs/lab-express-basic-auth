const router = require("express").Router();
const bcrypt = require('bcrypt')

const User = require('../models/User.model')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Register 
router.get("/registro", (req, res) => {
  res.render("signup-form");
});


router.post("/registro", (req, res) => {
  const { username, userPwd } = req.body

  if (userPwd.length === 0) {
    res.render('signup-form', { errorMsg: "Contraseña obligatoria" })
    return
  }

  const bcryptSalt = 10
  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(userPwd, salt)

  User
    .findOne({ username })
    .then(user => {
      if (user) {
        res.render('signup-form', { errorMsg: "El usuario ya existe" })
        return
      }

      User
        .create({ username, password: hashPass })
        .then(() => {
          res.redirect('/')
        })
        .catch(error => console.log(error))
    })
    .catch(err => console.log(err))

});

// Login 
router.get('/iniciar-sesion', (req, res) => {
  res.render('login-form')
})


router.post('/iniciar-sesion', (req, res) => {
  const { username, userPwd } = req.body
  if (userPwd.length === 0 || username.length === 0) {
    res.render('login-form', { errorMsg: "Todos los campos deben ser rellenados" })
    return
  }
  User
    .findOne({ username })
    .then(user => {
      // console.log(user)
      if (!user) {
        res.render('login-form', { errorMsg: "El usuario no existe" })
        return
      }
      if (bcrypt.compareSync(userPwd, user.password) === false) {
        res.render('login-form', { errorMsg: "Contraseña incorrecta" })
        return
      }
      // console.log("entro")
      req.session.currentUser = user
      // console.log(req.session.currentUser)
      res.redirect('/main')
    })
    .catch(err => console.log(err))
})

router.use('/main', (req, res, next) => {
  if (req.session.currentUser) {
    next()
  } else {
    res.render('index')
  }
})
router.get('/main', (req, res) => {
  const userPerfil = req.session.currentUser
  console.log(userPerfil)
  res.render('main', userPerfil)
})
router.get('/private', (req, res) => {
  res.send('rivate')
})
module.exports = router;

