const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

router.get("/auth/signup", (req, res, next) => {
    res.render("signup")
})

    router.post("/auth/signup", (req, res, next) => {
        const { username, password } = req.body
      
        if (username === "") {
          res.render("signup", { message: "Username cannot be empty" })
          return
        }
      
        if (password.length < 4) {
          res.render("signup", { message: "Password has to be minimum 4 characters" })
        }
      
        User.findOne({ username })
          .then(userFromDB => {
            if (userFromDB !== null) {
              res.render("signup", { message: "Username is already taken" })
            } else {
             
              const salt = bcrypt.genSaltSync()
              const hash = bcrypt.hashSync(password, salt)
      
              User.create({ username: username, password: hash })
                .then(createdUser => {
                  console.log(createdUser)
                  res.redirect("/auth/login")
                })
                .catch(err => {
                  next(err)
                })
            }
          })
      })  

      router.get("/auth/login", (req, res, next) => {
        res.render("login")
      })

module.exports = router