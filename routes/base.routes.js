const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const User = require('../models/usermodel')

// Endpoints


router.get('/registro', (req, res) => res.render('registro'))
router.post('/registro', (req, res) => {
    const { username, password } = req.body
    

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    User.findOne({ username })
        .then(foundUser => {

            if (foundUser) {
                res.render('registro', { errorMessage: 'El nombre de usuario escogido ya existe, prueba con otro!' })
                return
            }
            if (username.length < 8) {
                res.render('registro', { errorMessage: 'La vida es dura, pero has elegido un nombre demasiado corto, prueba de nuevo!' })
                return
            }
            User.create({ username: username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(err => console.log(err))
        }) 
        .catch(err => console.log(err))
})



router.get('/iniciar-sesion', (req, res) => res.render('iniciar-sesion'))
router.post('/iniciar-sesion', (req, res) => { 

    const { username, password } = req.body

    if (username === '' || password === '') {
        res.render('iniciar-sesion', { errorMessage: 'Usuario no encontrado, como lo vamos a encontrar si has dejado campos vacios? prueba de nuevo!' })
        return
    }

    User.findOne({ username })
        .then(foundUser => {
            if (!foundUser) {
                res.render('iniciar-sesion', { errorMessage: 'Usuario no encontrado' })
                return
            }
            if (bcrypt.compareSync(password, foundUser.password)){
                req.session.currentUser = foundUser
                res.redirect('/')
            }
            else {
                res.render('iniciar-sesion', { errorMessage: 'Has intruducido una contraseña incorrecta, prueba de nuevo!' })
            }
        })
        .catch(err => console.log(err))
})



module.exports = router
