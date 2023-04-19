const router = require("express").Router();
const User = require('../models/User.model')
const bcrypt = require("bcryptjs")


//Click the sign up button, get to the POST
router.get('/auth/signup', (req, res, next) => {
  res.render('signup')
})

//POST, open the form where information can be added
router.post('/auth/signup', (req, res, next) => {
  const { username, password } = req.body

  if (username === '') {
    res.render('signup', { message: `don't leave me empty :(` })
  }

  const passwordCheck = /[^*?$§]+/gm
  if (password === passwordCheck && password.length < 5) {
    res.render('signup', { message: `don't use weird special characters and smaller password then 5 characters :(` })
    return
  }
  User.findOne({ username })
  .then(userFromDB => {
    console.log(userFromDB)
   
    if(userFromDB !== null) {
        res.render('signup', { message: `already taken, pls be more creative` })
    } else {
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, salt)

    User.create({ username: username, password: hash })
    .then(createdUser => {
        res.redirect('/auth/login')
    })
    .catch(err => { next(err) })
    }
  })
  console.log('hiiiiii')
})

router.get('/auth/login', (req, res, next) => {
    res.render('login')
})

router.post('/auth/login', (req, res, next) => {
    const { username, password } = req.body

    User.findOne({ username })
    .then(userFromDB => {
        if (userFromDB => {
            res.render('login', { message: 'did you really forget your username?' })
            return
        })

        if (bcrypt.compareSync(password, userFromDB.password)) {
            req.session.user = userFromDB
            res.redirect("/profile")
          } else {
            res.render("login", { message: 'did you really forget your username?' })
            return
          }
    })
})



module.exports = router;