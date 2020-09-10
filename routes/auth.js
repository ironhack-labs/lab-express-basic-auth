const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User.model')

router.get('/', (req, res, next) => {
    res.render('signup')
})

router.post('/',(req, res, next) => {
    const {username, password} = req.body

    bcrypt.hash(password,10)
    .then(hashedPassword => {
      return User.create({
          username,
          password:hashedPassword
      })
  })
  .then(() => {
      res.send('User Created')
  })
  .catch(e => console.log(e))
})


router.get('/login',(req,res, next) => {
    res.render('login')
})

router.post('/login',(req,res, next) => {
    const {username,password} = req.body

    User.findOne({username})
    .then((user) => {
        console.log(user)
        bcrypt.compare(password, user.password)
        .then((result) => {
            console.log(result)
        })
    }) 
    .catch(e => console.log(e))
})






module.exports = router