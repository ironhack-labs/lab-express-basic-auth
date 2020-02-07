const express = require('express')
const router = express.Router()

const User = require("../model/user.model");

const bcrypt = require('bcrypt')
const bcryptSalt = 10 

router.get('/signup', (req,res) => res.render('auth/signup'))

router.post('/signup',(req,res) => {

    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
      res.render("auth/signup", { errorMessage: "Rellena los datos, ¡merluzo!" })
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
          res.render("auth/signup", { errorMessage: "Email ya resgitrado, ¡qué calvario!" })
          return
        }
      })
      .catch(err => console.log(err))
  
  
  }    
)

router.get("/login", (req, res) => res.render("auth/login"))

router.post("/login", (req, res) => {

  const { email, password } = req.body

  if (email === "" || password === "") {
    res.render("auth/login", { errorMessage: "Rellena los campos" });
    return
  }

  User.findOne({ email: email })
    .then(theUserFound => {
      if (!theUserFound) {
        res.render("auth/login", { errorMessage: "Email no registrado" });
        return
      }

      if (bcrypt.compareSync(password, theUserFound.password)) {
        req.session.currentUser = theUserFound;
        res.redirect("/");
      } else {
        res.render("auth/login", { errorMessage: "Contraseña incorrecta" })
      }
    })
    .catch(err => console.log(err))
}) 

router.get("/logout", (req, res, next) => req.session.destroy((err) => res.redirect("/login")))


module.exports = router;
