const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10

const { isLoggedOut } = require('../middleware/route-guard')

router.get("/registro", (req, res) => {
    res.render("auth/signup")
})

router.post("/registro", (req, res, next) => {

    const { email, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(passwordHash => User.create({ email, password: passwordHash }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})






router.get("/inicio", isLoggedOut, (req, res) => {
    res.render("auth/login")
})

router.post("/inicio", isLoggedOut, (req, res, next) => {

    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ email })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Asegurate de que los datos son correctos' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Asegurate de que los datos son correctos' })
                return
            }

            req.session.currentUser = foundUser
            res.redirect('/')
        })
        .catch(err => next(err))
})



router.get('/logOut', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router