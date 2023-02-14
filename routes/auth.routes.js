const router = require("express").Router()
const bcrypt = require('bcryptjs')

//Model
const User = require('./../models/User.model')

//Middlewares
const { isLoggedOut } = require('../middlewares/route-guard')
const { isLoggedIn } = require('../middlewares/route-guard')

//Salt
const saltRounds = 10

// Sign-up
router.get('/register', isLoggedOut, (req, res) => {
    res.render('auth/sign-up')
})

router.post('/register', isLoggedOut, (req, res, next) => {
    const { username, userPass } = req.body
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPass, salt))
        .then(hashPass => User.create({ username, password: hashPass }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    if (!username || !userPass) {
        res.render('auth/sign-up', { errorMessage: 'Campos vacios' })
        return
    }
})

// Login
router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/log-in')
})

router.post('/login', isLoggedOut, (req, res) => {
    const { username, userPass } = req.body
    if (!username || !userPass) {
        res.render('auth/log-in', { errorMessage: 'Campos vacios' })
        return
    }
    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                return res.render('auth/log-in', { errorMessage: 'Datos incorrectos' })
            }
            if (!bcrypt.compareSync(userPass, user.password)) {
                return res.render('auth/log-in', { errorMessage: 'Datos incorrectos' })
            }
            else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
})

// Logout
router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router
