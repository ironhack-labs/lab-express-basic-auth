const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

/* GET home page */
router.get("/auth/signup", (req, res, next) => {
  res.render("auth");
});

router.post("/auth/signup", (req, res, next) => {
  const { username, password } = req.body

  if (password.length < 4) {
    res.render("auth", { message: "Password has to be minimum 4 characters" })
  }
 
  User.findOne({ username })
  .then(userFromDB => {
    console.log(userFromDB)

    if (userFromDB !== null) {
      res.render("auth", { message: "Username is already taken" })
    } else {
      const salt = bcrypt.genSaltSync()
      const hash = bcrypt.hashSync(password, salt)
      console.log(hash)

      User.create({username: username, password: hash })
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

router.post("/auth/login", (req, res, next) => {
  const { username, password } = req.body

  User.findOne({ username })
    .then(userFromDB => {
      if (userFromDB === null) {
        res.render("login", { message: "Wrong credentials" })
        return
      }

      if (bcrypt.compareSync(password, userFromDB.password)) {
        req.session.user = userFromDB
        res.redirect("/profile")
      } else {
        res.render("login", { message: "Wrong credentials" })
        return
      }
    })
})

router.get("/profile", (req, res, next) => {
  const user = req.session.user
  res.render("profile", { user })
})

router.get("/auth/logout", (req, res, next) => {
  req.session.destroy()
  res.redirect("/")
})

module.exports = router;