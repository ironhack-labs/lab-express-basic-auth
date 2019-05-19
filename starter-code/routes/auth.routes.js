const express = require("express")
const router = express.Router()
const bcrypt       = require("bcrypt")
const bcryptSalt   = 12
const User         = require("../models/User")




router.get("/signup", (req, res) => {
  res.render("auth/signup")
})

router.post("/signup", (req, res) => {
  const {username, password} = req.body

  if(!username || !password) {
    console.log("campos vacios")
    res.render("auth/signup")
    return
  }

  User.findOne({username})
    .then(foundUser => {
      if(foundUser) {
        console.log("usuario ya en base de datos")
        res.render("auth/signup")
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({username, password: hashPass})
        .then( createdUser => {

          console.log(createdUser)
          res.redirect("/")

        })
        .catch()
    })
    
    .catch()

})

router.get("/login", (req, res) => {
  res.render("auth/login")
})

router.post("/login", (req,res)=> {
  const {username, password} = req.body

  
  User.findOne({username})
    .then( foundUser => {

      if(!foundUser) {
        res.render("auth/login", {errMessage: "Usuario no encontrado. Sign Up first"})
        return
      }

      if( bcrypt.compareSync(password, foundUser.password) ) {
        // console.log(foundUser,"PASSWORDS COINCIDEN!!!!")
        req.session.currentUser = foundUser
        // console.log(req.session.currentUser)
        res.redirect("/")
      } else {

        res.render("auth/login", {errorMessage: "Pass incorrect"})

      }

    })
})


router.use((req, res, next) => {
  if(req.session.currentUser) {
    console.log("ha entrado en el if")
    next()
    return
  }

  res.redirect("/user/login")

})


router.get("/private/main", (req, res) => {
  res.render("private/main")
})


router.get("/private/private", (req, res) => {
  res.render("private/private")
})

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log("error destruyendo sesion", err)

    res.redirect("/user/login")
  })
})

module.exports = router