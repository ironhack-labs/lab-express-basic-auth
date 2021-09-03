const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User.model")

router.get("/", (req, res, next) => res.render("index"))


// Registrarse
router.get('/register', (req, res) => res.render('User/sign-up'))
router.post('/register', (req, res) => {
console.log('loquesea')
  const { username, userPwd } = req.body

  if (userPwd.length === 0) {       
    res.render('User/sign-up', { errorMsg: 'Password Mandatory' })
    return
  }

  User
    .findOne({ username })
    .then(user => {

      if (user) {                   
        res.render('User/sign-up', { errorMsg: 'User Already Registered' })
        return
      }

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(userPwd, salt)     

      User
        .create({ username, password: hashPass })       
        .then((newUser) => {
          
          req.session.currentUser = newUser
          console.log(req.session);
          res.redirect('/User/main')})
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
})

// Entrar
router.get('/log-in', (req, res) => res.render('User/log-in'))
router.post('/log-in', (req, res) => {

  const { username, userPwd } = req.body

  if (userPwd.length === 0 || username.length === 0) {       
    res.render('User/log-in', { errorMsg: 'Fill All The Fields' })
    return
  }

  User
    .findOne({ username })
    .then(user => {

      if (!user) {
        res.render('User/log-in', { errorMsg: 'User Not Found' })
        return
      }

      if (bcrypt.compareSync(userPwd, user.password) === false) {
        res.render('User/log-in', { errorMsg: 'Incorrect Passworld' })
        return
      }

      req.session.currentUser = user
      res.redirect('/private')
    })
    .catch(err => console.log(err))

})

// MIDDLEWARE DETECTOR DE SESIÓN
router.use((req, res, next) => {
  req.session.currentUser ? next() : res.render('User/log-in', { errorMsg: 'Not Authorized' })
})

router.get('/User/main', (req, res) => res.render('User/main'))

router.get('/private', (req, res) => res.render('User/private'))

router.get('/profile', (req, res) => {
  res.render('User/profile', { user: req.session.currentUser })
})

module.exports = router;
