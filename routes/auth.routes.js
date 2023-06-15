const router = require("express").Router()
const bcryptjs = require("bcryptjs")
const User = require("../models/User.model")
const saltRounds = 10

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup")
})

router.post('/signup', (req, res, next) => { 
  const { username, password } = req.body 

  bcryptjs.genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      User.create({
        username,
        passwordHash: hashedPassword
        })
    })
    .then(user => {
      res.redirect('/user-profile')
      return user
    })
})

router.get('/user-profile', (req, res, next) => { 
  res.render('users/user-profile')
})

module.exports = router
