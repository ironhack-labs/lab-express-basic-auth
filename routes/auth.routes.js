const { Router } = require('express')
const router = new Router()
const User = require('../models/User.model')

const bcryptjs = require('bcryptjs')
const saltRounds = 10

router.get('/signup', (req, res) => res.render('auth/signup'))



router.post('/signup',(req, res, next) => {
     const { username, email, password } = req.body

     bcryptjs
     .genSalt(saltRounds)
     .then((salt) => bcryptjs.hash(password, salt))
     .then((hashedPassword )=> {
        return User.create({
            username,  
            email,
            password: hashedPassword
        })
     })
     .then((userFromDB) => {
        console.log('New user created: ', userFromDB)
        res.redirect('/userProfile')
     })
     .catch(error => next(error))
})

router.get('/userProfile', (req, res) => res.render('auth/user-profile'))

module.exports = router