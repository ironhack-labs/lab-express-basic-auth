const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guards')


router.get('/register', isLoggedOut, (req, res, next) => {
    
    res.render('auth/signup')

})

router.post('/register', isLoggedOut, (req, res, next) => {

    const { username, email, plainPassword } = req.body

    if ( email.length === 0 || plainPassword.length === 0 || username.length === 0) {
        
        res.render('auth/signup', {errorMessage: 'Todos los campos son obligatorios'})
        return
    }

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(plainPassword, salt))
    .then(hashedPassword => User.create({ username, email, password: hashedPassword }))
    .then(() => res.redirect('login'))
    .catch(err => next(err))

})


router.get('/login', isLoggedOut, (req, res, next) => {
    
    res.render("auth/login")

})

router.post('/login', isLoggedOut, (req, res, next) => {

    const { email, password } = req.body

    if ( email.length === 0 || password.length === 0) {
        
        res.render('auth/login', {errorMessage: 'Todos los campos son obligatorios'})
        return
    }

    User
        .findOne({ email })
        .then(foundUser => {

            if(!foundUser) {
                res.render('auth/login', {errorMessage: 'Usuario no encontrado'})
                return
            }

            if(!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', {errorMessage: 'Contraseña incorrecta'})
                return
            }

            req.session.currentUser = foundUser
            res.redirect('/')
        })

})


router.get('/desconect', (req, res, next) => {

  req.session.destroy(() => res.redirect('/'))

})

module.exports = router