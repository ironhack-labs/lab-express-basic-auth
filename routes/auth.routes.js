const express = require('express')
const router = express.Router()

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const User = require('./../models/User.model')

//Sign Up
router.post('/signup', (req, res) => {

    const {username, password} = req.body

    console.log(req.body)

    //Validación de Sign Up
    if (username.length === 0 || password.length === 0) {
        res.render('auth/signup', { errorMsg: 'Por favor rellena los campos!' })
        return
    }

    User.
        findOne({username})
        .then(theUser => {
            if(!theUser) {
                const salt = bcrypt.genSaltSync(bcryptSalt)
                const hashPass = bcrypt.hashSync(password, salt)
                User
                    .create({ username, password: hashPass})
                    .then(theUserCreated => {
                        console.log('El usuario creado es:', theUserCreated)
                        res.redirect('/')
                    })
                    .catch(err => console.log('Ha ocurrido un error', err))   
            } else {
                res.render('auth/login',{ errorMsg: 'Usuario ya existente!' })
                return
            }
        })
    
})

//Log In
router.post('/login', (req, res) => {

    const {username, password} = req.body

    User
        .findOne({username})
        .then(theUser => {
            console.log(theUser)
            //Validación del Log In
            if (!theUser) {
                res.render('auth/login', {errorMsg: 'Usuario no encontrado'})
                return
            }

            if(bcrypt.compareSync(password, theUser.password)) {
                req.session.currentUser = theUser
                console.log('Usuario iniciado!', req.session.currentUser)
                res.redirect('/')
            } else {
                res.render('auth/login', { errorMsg: 'Contraseña incorrecta' })
                return
            }
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
    console.log('Hastaluego primo')
})

module.exports = router