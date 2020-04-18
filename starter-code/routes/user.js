const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const User = require('../models/user-model')

router.get('/signup', (req, res, next) => res.render('auth/signup'))
router.post('/signup', (req ,res, next) => {
    const {user, password} = req.body

    if(!user || !password){
        res.render('auth/signup', {errorMessage: '<p>Rellena los campos</p>'})
        return
    }

    User.findOne({user})
    .then(foundUser => {
        if(foundUser){
            res.render('auth/signup', {errorMessage: '<p>Este Usuario ya existe</p>'})
            return
        }

        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)

        User.create({user, password: hashPass})
        .then(newUser => res.redirect('/'))
        .catch(error => console.log('Hay un Error en la creación', error))
        console.log("-------------------------------------------------------------------------------usuario creado-")

    })
    .catch(error => console.log('Hay un Error en la busqueda del usuario', error))
})

router.get('/login', (req, res, next) => res.render('auth/login'))
router.post('/login', (req, res, next) => {
    const {user, password} = req.body

    if(!user || !password){
        res.render('auth/login', {errorMessage: '<p>Este Usuario ya existe</p>'})
        return
    }
    User.findOne({user})
    .then(foundUser => {
        if(!foundUser){
            res.render('auth/login', {errorMessage: '<p>Este usuario o la contraseña no existen</p>'})
            return
        }

        if(!bcrypt.compareSync(password, foundUser.password)){
            res.render('auth/login', {errorMessage: '<p>Contraseña incorrecta</p>'})
            return
        }
        console.log('-----------------------------------------------------------------------todavia no estas logueado')

        req.session.currentUser = foundUser
        res.redirect('/main')
    })
    .catch(error => console.log('Hay un Error en la busqueda del usuario al loguearse ', error))
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router