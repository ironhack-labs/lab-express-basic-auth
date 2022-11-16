const router = require('express').Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")


router.get("/auth/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

router.post("/auth/signup", (req, res, next) => {
    const { username, password } = req.body

    if (username === "") {
        res.render("auth/signup", {message: "Please provide a username"} )
        return
    }
    
    if (password.length < 4) {
        res.render("auth/signup", {message: "Password must be minimum 4 characters" })
        return
    }

    User.findOne({username})
    .then(user => {
        if (user !== null) {
            res.render("auth/signup",  {message: "Username already in use.  Please create new username."})
        } else {
        
            const salt = bcrypt.genSaltSync()
            const hash = bcrypt.hashSync(password, salt)

            User.create({username, password: hash})
            .then(newUser => {
                res.redirect("/auth/login")
            })
            .catch(error => next(error))
        }
    })
})

router.get("/auth/login", (req, res, next) => {
    res.render("auth/login")
})
  
router.post("/auth/login", (req, res, next) => {
    const {username, password} = req.body
  
    User.findOne({username})
      .then(user => {
        if (user === null) {
          res.render("auth/login", {message: "Wrong credentials"})
          return
        }

        if (bcrypt.compareSync(password, user.password)) {
          req.session.user = user
          res.redirect("/profile")
        } else {
          res.render("auth/login", {message: "Wrong credentials"})
          return
        }
    })
})
  
router.get("/auth/logout", (req, res, next) => {
    req.session.destroy()
    res.redirect("/")
})

module.exports = router;