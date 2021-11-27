const { Router } = require('express')
const router = new Router()
const mongoose = require("mongoose")
const User = require("../models/User.model")

router.get("/sign-up", (req, res, next)=> {
    res.render("sign-up")
  })
  
  const bcrtptyjs = require('bcryptjs')
  const saltRounds = 10;

  router.post('/signup', (req, res, next) => {
      const { username, password } = req.body

      bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
          return User.create({
              username,
              passwordHash: hashedPassword
          })
      })
      .catch(error => next(error))
  })


module.exports = router