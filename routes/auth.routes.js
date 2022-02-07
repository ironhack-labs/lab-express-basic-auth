const router = require("express").Router()
const bcryptjs = require('bcryptjs')

const User = require('../models/User.model')

const saltRounds = 10


router.get('/register', (req, res, next) => {
    res.render('auth/signup-form')
})

router.post('/register', (req, res, next) => {
    const { email, password } = req.body
    //res.send(req.body)
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            console.log('el hash creado es', hashedPassword)
            return User.create({ email, password: hashedPassword })
        })
        .then(createdUser => res.redirect('/'))
        .catch(error => next(error))
})

router.get('/signin', (req, res, next) => {
    res.render('auth/login-form')
    // res.send('holaaaa')
})

router.post('/signin', (req, res, next) => {
    const { email, password } = req.body
    //console.log(req.body)

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Please fill all fields' })
        return
    }

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login-form', { errorMessage: 'That email is not in our DataBase' })
                return
            } else if (bcryptjs.compareSync(password, user.password) === false) {
                res.render('auth/login-form', { errorMessage: 'Incorrect password' })
                return
            } else {
                req.session.currentUser = user
                console.log(req.session)
                res.redirect('/profile')
            }
        })
})

module.exports = router