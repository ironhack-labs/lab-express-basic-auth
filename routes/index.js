const router = require("express").Router();
const bcrypt = require('bcrypt')
const User = require('./../models/User.model')
const app = require("../app")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get('/sign-up', (req, res, next) => {
  res.render('sign-up')
})
router.post('/sign-up', (req, res, next) => {

  const { username, password } = req.body
  console.log(req.body)
  User
    .findOne({ username })
    .then(user => {

      if (user) {
        res.render('sign-up', { errorMessage: 'Usuario ya registrado' })
        return
      }

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User
        .create({ username, password: hashPass })
        .then(() => {
          console.log('todo bien')
          res.redirect('/')
        })
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))

})
router.get("/login", (req, res, next) => {
  res.render("login");
})
router.post("/login", (req, res, next) => {

  const { username, password } = req.body
  User
    .findOne({ username })
    .then((user) => {
      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)
      console.log(user)
      if (user.password === hashPass)
        res.send('todo correcto')
      else
        res.send('contraseñas distintas')

    })
})

module.exports = router;
