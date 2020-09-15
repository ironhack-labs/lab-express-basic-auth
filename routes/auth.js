const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

router.get('/signup', (req, res, next) => {
    res.render('signup')
})

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body

    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            return User.create({
                username,
                password: hashedPassword
            })
        })
        .then( () => {
            res.send('user created')
        })
        .catch(e => {
            next(e)
        })

})

router.get('/login', (req, res, next) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    const {username,password} = req.body
    User.findOne({username})
    .then ((user) => {
        console.log(user)
        return bcrypt.compare(password, user.password)
    })
    .catch(e => {
        next(e)
    })
})

module.exports = router