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

  // Validation of username and password input existance
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Please provide valid username and password",
    })
  }

  // passwor safety validation
  const regex = /(?=.*\d)(?=.*[A-Z]).{8,}$/
  if (!regex.test(password)) {
    return res.status(400).render("auth/signup", {
      errorMessage:
        "Password must contain 1 uppercased letter, 1 digit, and larger than 7 characters",
    })
  }

  User.create({ username, passwordHash: enctryptedPass })
    .then((userfromDB) => {
      const user = userfromDB
      // @ts-ignore
      req.session.currentUser = user
      res.redirect("/user-profile")
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message })
      } else if (error.code === 11000) {
        // if user already exists
        res.status(500).render("auth/signup", {
          errorMessage: "Username is already registered, please try again",
        })
      } else {
        next(error)
      }
    })
})

router.get("/login", isLoggedOut, (req, res, next) => res.render("auth/login"))

router.post("/login", (req, res, next) => {
  const { username, password } = req.body

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    })
  }

  User.findOne({ username })
    .then((user) => {
      if (user && bcryptjs.compareSync(password, user.passwordHash)) {
        // @ts-ignore
        req.session.currentUser = user
        res.redirect("/user-Profile")
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect user or password.",
        })
      }
    })
    .catch((err) => next(err))
})

router.get("/user-profile", logStatus, isLoggedIn,(req, res, next) => {
  // @ts-ignore
  // console.log(req.session.currentUser)
  res.render("users/user-profile", { userInSession: req.session.currentUser })
})

router.get('/main', isLoggedIn, logStatus, (req, res, next) => res.render('auth/main'))

router.get("/private", isLoggedIn, logStatus, (req, res, next) => res.render("auth/private"))

router.get('/logout', isLoggedIn, logStatus,(req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err)
    
    res.clearCookie('connect.sid')
    res.redirect("/")
  })
})

module.exports = router