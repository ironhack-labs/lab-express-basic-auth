const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')

//render del signup
router.get('/registroUser', (req, res, next) => {
    res.render('auth/signup')
})

//hacemos el post para el signup
router.post('/registroUser', (req, res, next) => {
    //constante con el mail y la contraseña sin cifrar
    const { email, plainPassword } = req.body

    if (email.length === 0 || plainPassword.length === 0) {//aseguramos que los camplos esten rellenos
        res.render('auth/signup', { errorMessage: 'Estos campos son obligatorios' })
        return
    }

    bcrypt
        .genSalt(saltRounds)//hacemos genSalt y pasamos el saltRounds que lleva el 10 asequible para el usuario
        .then(salt => bcrypt.hash(plainPassword, salt))//hasheamos la password
        .then(hashedPassword => User.create({ email, password: hashedPassword }))
        .then(() => res.redirect('sessionStart'))//redirigimos a inicio de sesión
        .catch(err => next(err))
})

router.get('/sessionStart', (req, res, next) => {
    res.render('auth/login')
})

router.post('/sessionStart', (req, res, next) => {

    const { email, password } = req.body
    //primer if para comprobar que tanto mail como password tengan la medida necesaria
    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Estos campos son obligatorios' })
        return
    }

    User
        .findOne({ email })//buscamos solo un mail porque solo puede haber uno
        .then(foundUser => {

            if (!foundUser) {//si no existe renderizamos el mensaje de error
                res.render('auth/login', { errorMessage: 'Usuario desconocido' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {//comparamos la contraseña que tenemos registrada y la que ingresa el user
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }

            req.session.currentUser = foundUser //si todo va bien, redirigimos a home
            res.redirect('/')
        })
})

router.get('/disconnect', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router