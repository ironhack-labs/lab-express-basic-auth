const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")

const User = require('../models/user.model')

const bcryptSalt = 10


//Iteración 1

router.get('/registro', (req, res) => res.render('signup-form'))
router.post('/registro', (req, res) => {

    const { username, password} = req.body

    if(username === '' || password === '') {
        res.render('signup-form', { errorMessage: 'Hay que rellenar los campos!'})
        return
    }
    
    User.findOne({ username})
        .then(theFoundUser => {

            if(theFoundUser) {
                res.render('signup-form', { errorMessage: 'Usuario ya registrado'})
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create ({ username, password: hashPass})
                .then(() => res.redirect('/'))
                .catch (err => console.log('ERROR:', err))

        })
        
        .catch(err => console.log('ERROR:', err))
})



// Iteración 2
router.get('/iniciar-sesion', (req, res) =>res.render('login-form'))
router.post('/iniciar-sesion', (req, res) => {

    const { username, password} = req.body
    console.log(username, password)
    if(username === '' || password === '') {
        res.render('login-form', { errorMessage: 'Hay que rellenar los campos!'})
        return
    }

    User.findOne({ username })
    .then(registeredUser => {
        console.log(registeredUser)
        if(!registeredUser){
            res.render('login-form', { errorMessage: 'Usuario no registrado'})
            return
        }

        if (bcrypt.compareSync(password, registeredUser.password)) {
            req.session.currentUser = registeredUser
            console.log(req.session)
            res.redirect('/perfil')
        } else {
            res.render('login-form', { errorMessage: 'Contraseña incorrecta'})
        }
    })
    .catch(err => console.log(err))
})

router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect("/iniciar-sesion"))
})
module.exports = router