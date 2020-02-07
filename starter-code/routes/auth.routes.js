const express = require('express')
const router = express.Router()
const User = require("../model/user.model")
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// -----


router.get('/signup', (req, res) => {
  console.log("signup")
  res.render('signup')
})

router.post('/signup', (req, res) => {

  const { email, password } = req.body
  // condicion de vacio
  if (email.length === 0 || password.length === 0) {
    res.render("signup", { errorMessage: "ponlo bien crack" })
    return
  }

  User.findOne({ email: email })
    .then(theExistingUser => {
      if (!theExistingUser) {

        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)
        User.create({ email, password: hashPass })
          .then(newUser => res.redirect("/"))
          .catch(err => console.log(err))

      } else {
        res.render("signup", { errorMessage: "email malito" })
        return
      }

    })
    .catch(err => console.log(err))
})

console.log("pasa por aqui")
router.get("/login", (req, res) => res.render("login"))
router.post("/login", (req, res) => {

  const { email, password } = req.body

  if (email === "" || password === "") {
    res.render("login", { errorMessage: "Rellena los campos" });
    return
  }

  User.findOne({ email: email })
    .then(theUserFound => {
      if (!theUserFound) {
        res.render("login", { errorMessage: "Email no registrado" });
        return
      }

      if (bcrypt.compareSync(password, theUserFound.password)) {
        req.session.currentUser = theUserFound;
        res.redirect("/");
      } else {
        res.render("login", { errorMessage: "Contraseña incorrecta" })
      }
    })
    .catch(err => console.log(err))
})



module.exports = router;


