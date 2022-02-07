const { Router } = require("express");
const bcryptjs = require("bcryptjs")

const User = require("./../models/User.model");
const res = require("express/lib/response");
const saltRounds = 10

const router = require("express").Router();

// ------ SING UP routes
router.get("/signup", (req, res, next) => res.render("auth/signup-form-page"))

router.post("/signup", (req, res, next) => {
  const { username, formPwd } = req.body

  if (username.length === 0 || formPwd.length === 0) {
    res.render("auth/signup-form-page", { sendError: 'Rellena todos los campos' })
    return
  }

  User
    .find()
    .then(users => {
      users.forEach(elm => {
        if (elm.username === username) {
          res.render("auth/signup-form-page", { sendError: 'El nombre de usuario no está disponible' })
          return
        }
      })
    })

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(formPwd, salt))
    .then(hashedPwd => User.create({ username, password: hashedPwd }))
    .then(() => res.redirect('/'))
    .catch(err => next(err))
})

// ------ LOG IN routes
router.get("/login", (req, res, next) => res.render("auth/login-form-page"))

router.post("/login", (req, res, next) => {
  const { username, formPwd } = req.body

  if (username.length === 0 || formPwd.length === 0) {
    res.render("auth/login-form-page", { sendError: 'Rellena todos los campos' })
    return
  }

  User
    .findOne({ username })
    .then(user => {
      if (!user) {
        res.render("auth/login-form-page", { sendError: 'El nombre de usuario no es válido' })
        return
      } else if (!bcryptjs.compareSync(formPwd, user.password)) {
        res.render("auth/login-form-page", { sendError: 'La contraseña es incorrecta' })
        return
      } else {
        req.session.currentUser = user
        res.redirect("/main")
      }
    })
    .catch(err => next(err))
})

// ------ LOG OUT route
router.post("/logout", (req, res, next) => {
  req.session.destroy(() => res.redirect("/login"))
})

module.exports = router;
