const express = require('express')
const router = express.Router()

const bcrypt = require("bcrypt")

const User = require('../models/User.model')

const bcryptSalt = 10



router.get('/register', (req, res) => res.render('sign-form'))

router.post('/register', (req, res) => {
    
    const { username, password } = req.body
    console.log({ username })
    if (username === '' || password === '') {
        res.render('login-form', { errorMessage: 'Debe rellenar los campos' })
        return
    }
    
    User.findOne({ username })
    .then(theFoundUser => {
        
        if (theFoundUser) {
            res.render('sign-form', { errorMessage: 'Usuario ya registrado' })
            return
        }
        
        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)
        
        User.create({ username, password: hashPass })
        .then(() => res.redirect('/login'))
        .catch(err => console.log(err))
        
    })
    .catch(err => console.log('error:', err))
})




router.get('/login', (req, res) => res.render('login-form'))
router.post('/login', (req, res) => {
    
    const { username, password } = req.body
    
    if (username === '' || password === '') {
        res.render('login-form', { errorMessage: 'Debe rellenar los campos' })
        return
    }
    
    User.findOne({ username })
    .then(foundUser => {
        
        if (!foundUser) {
            res.render('login-form', { errorMessage: 'Usuario no registrado' })
            return
        }
        
        if (bcrypt.compareSync(password, foundUser.password)) {
            req.session.currentUser = foundUser     
            res.render("profile", req.session.currentUser)
        } else {
            res.render('login-form', { errorMessage: 'Contraseña incorrecta' })
        }
    })
    .catch(err => console.log(err))
})


router.get('/cerrar-sesion', (req, res) => req.session.destroy(() => res.redirect("/login")))


module.exports = router;

