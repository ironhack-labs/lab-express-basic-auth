const router = require("express").Router()
const bcryptjs = require("bcryptjs")
const User = require("../models/User.model")
const mongoose = require("mongoose")
const { isLoggedIn, isLoggedOut, logStatus } = require('../middleware/route-guard')

/* GET home page */
router.get("/signup", isLoggedOut, (req, res, next) => res.render("auth/signup"))

router.post('/signup',(req, res, next) => { 
  const { username, password } = req.body

  const salt = bcryptjs.genSaltSync(12)
  const enctryptedPass = bcryptjs.hashSync(password, salt)

    User.create({ username, passwordHash: enctryptedPass })
    .then((userfromDB) => {
      res.redirect("/user-profile")
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message })
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        })
      } else {
        next(error)
      }
    })
})

router.get("/login", isLoggedOut, (req, res, next) => res.render("auth/login"))

router.post("/login", (req, res, next) => {
  const { email, password } = req.body

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    })
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        })
        return
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // @ts-ignore
        req.session.currentUser = user
        res.redirect("/user-Profile")
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." })
      }
    })
    .catch((err) => next(err))
})

router.get('/user-profile', isLoggedIn, logStatus,(req, res, next) => { 
  // @ts-ignore
  res.render('users/user-profile', {userInSession: req.session.currentUser})
})

router.get('/main', isLoggedIn, logStatus, (req, res, next) => res.render('auth/main'))

router.get("/private", isLoggedIn, logStatus, (req, res, next) => res.render("auth/private"))

router.get('/logout', isLoggedIn, logStatus,(req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err)
    res.redirect("/")
  })
})

module.exports = router