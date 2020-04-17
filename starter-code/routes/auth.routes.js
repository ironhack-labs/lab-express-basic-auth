const express = require('express')
const router = express.Router()

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const User = require('../models/User.model')

router.get('/registro', (req, res, next) =>    res.render('registro'))
router.post('/registro', (req, res, next) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render('registro', { errorMessage: '<p>No puede ir vacío, panoli</p>' })
        return
    }
    
    if (password.length < 10) {
        res.render('registro', { errorMessage: '<p>La contraseña tiene que ser un poquito mas larga, tio</p>' })
        return
    }

    User.findOne({username})
        .then(theFoundUser => {
            if (theFoundUser) {
                res.render('registro', { errorMessage: '<p>Eres muy poco original, piensa otro nombre de usuario, alguien lo pensó antes que tú</p>' })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(nuevoRegistro => res.redirect('/registro'))
                .catch(err => console.log("Hubo un error!", err))
        })

        .catch(err => console.log("Hubo un error!", err))
})

router.get('/login', (req, res, next) => res.render('login'))
router.post('/login', (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.render('login', { errorMessage: '<p>No puede ir vacío, panoli</p>' })
        return
    }

    User.findOne({username})
        .then(foundUser => {
            if (!foundUser) {
                res.render('login', {errorMessage: '<p>No te acuerdas ni de tu nombre</p>'})
                return
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('login', { errorMessage: '<p>MAAAL! Existen aplicaciones para acordarse de las contraseñas</p>' })
                return
            }
            req.session.currentUser = foundUser
            res.redirect('/profile')
        })

        .catch(err => console.log(err))

})


module.exports = router