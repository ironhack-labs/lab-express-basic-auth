const res = require("express/lib/response")
const bcryptjs = require('bcryptjs')

const User = require('./../models/User.model')
const saltRounds = 10

const router = require("express").Router()



router.get("/registro", (req, res, next) => res.render("register/reg"))

router.post("/registro", (req, res, next)=> {
     const {username, password} = req.body

     bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log('El hash a crear en la BBDD es', hashedPassword)
      return User.create({ username, password: hashedPassword })
    })
    .then(createdUser => res.redirect('/'))
    .catch(error => next(error))
})


module.exports = router