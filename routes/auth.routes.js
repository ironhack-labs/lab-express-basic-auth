const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('./../models/User.model')
const saltRounds = 10

router.get('/sign-up', (req, res) => {
    res.render('auth/signup')
})

router.post('/sign-up', (req, res, next) => {
    const { username, email, password, spiritAnimal, phoneNumber } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(passwordHash => User.create({ username, email, password: passwordHash, spiritAnimal, phoneNumber }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})

router.get('/log-in', (req, res) => {
    res.render('auth/login')
})


router.post('/log-in', (req, res,) => {
    const { username, email, password, phoneNumber } = req.body

    if (username.length === 0 || email.length === 0
        || password.length === 0 || phoneNumber < 9) {
        res.render('auth/login', { errorMessage: 'Rellena todos los campos porfi' })
        return
    }
    User
        .findOne({ $or: [{ email }, { phoneNumber }, { username }] })//esto lo he tenido que buscar
        .then(foundUser => {
            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'No te has registrado' })
                return
            }
            if (bcrypt.compareSync(password, foundUser.password) === false) {
                res.render('auth/login', { errorMessage: 'Tu contraseña es incorrecta' })
                return
            }
            req.session.currentUser = foundUser
            console.log('SESIÓN INICIADA -->', req.session)
            res.redirect('/spirit-animal')
        })
        .catch(err => next(err))


})

module.exports = router;