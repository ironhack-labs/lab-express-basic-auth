const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User.model')
const checkLogin = require('../middleware/checkLogin')

router.get('/', (req, res, next) => {
    res.render('signup')
})

router.post('/',(req, res, next) => {
    const {username, password} = req.body
    if(!username || !password){
        res.render('signup', {errorMessage:'All fields are required, okay?'})
        return
    }
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

  .catch(e => {
      if(e.code === 11000){
        res.render('signup', {
            errorMessage: 'Username needs to be unique.'
        })
    } else {
        next(e)
    }
})
})


router.get('/login',(req,res, next) => {
    res.render('login')
})

router.post('/login',(req,res, next) => {
    const {username,password} = req.body

    let currentUser

    if(!username || !password){
        res.render('login', {errorMessage:'All fields are required, okay?'})
        return
    }

    User.findOne({username})
    .then(user => {
        if(user){
            currentUser = user 
            return bcrypt.compare(password, user.password)
        }
    })
        .then(result => {
           if(!result) {
               return res.send('Incorrect Password')
           }
           req.session.user = currentUser
           /* res.send('Now logged in!') */
           res.redirect('/auth/main')
        })
    .catch(e => console.log(e))
})

    router.get('/main', checkLogin, (req, res, next) => {
        res.render('main')
    })

    router.get('/private', checkLogin, (req, res, next) => {
        res.render('private')
    })


module.exports = router