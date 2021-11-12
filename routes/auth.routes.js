const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcrypt")


router.get("/signup", (req, res) => res.render("auth/signup"))

router.post("/signup", (req, res) => {

  const { username, password } = req.body

  
  User.find({ username })
    .then(user => {

      if (user.length) {
        res.render("auth/signup", { errorMessage: "Usuario ya existente." })
      } else {

        const bcryptSalt = 10
        const salt = bcrypt.genSaltSync(bcryptSalt)
        
        const hashPass = bcrypt.hashSync(password, salt)

        User.create({ username, password: hashPass })
          .then(createdUser => res.redirect("/auth/login"))
          .catch(err => console.log(err))
      }

    })

})

router.get("/login", (req, res) => {
  res.render("auth/login")
})

router.post("/login", (req, res) => {

  const { username, password } = req.body

  User.findOne({ username })
    .then(user => {

      
      if (!user) {
        res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
        return
      }

      if (bcrypt.compareSync(password, user.password) === false) {
        res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
        return
      }
      req.session.currentUser = user
      res.redirect("/")
    })
    .catch(err => console.log(err))
})


router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})


module.exports = router;