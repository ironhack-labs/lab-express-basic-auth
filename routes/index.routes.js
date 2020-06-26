const express = require('express');
const router = express.Router();

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const User = require('./../models/User.model')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'))

/* GET main page */
router.get('/main', (req, res) => res.render('main'))





//Sign Up

router.get('/registro', (req, res) => res.render('auth/signup'))

router.post('/registro', (req, res) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/signup', { errorMsg: 'Usuario o contraseña inválidos' })
        return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    User
        .create({ username, password: hashPass })
        .then(theUserCreated => {
            console.log('Se ha creado el usuario registrado', theUserCreated)
            res.redirect('/')
        })
        .catch(err => console.log("Error", err))
})




// Login

router.get('/iniciar-sesion', (req, res) => res.render('auth/login'))
router.post('/iniciar-sesion', (req, res) => {

    const { username, password } = req.body


    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMsg: 'Usuario o contraseña inválidos' })
        return
    }

    User.findOne({ username: username })
        .then(theUser => {

            if (!theUser) {
                res.render('auth/login', { errorMsg: 'Usuario incorrecto' })
                return
            }

            if (bcrypt.compareSync(password, theUser.password)) {

                req.session.currentUser = theUser
                console.log('Sesión iniciada, usuario:', req.session.currentUser)
                res.redirect('/private')

            } else {

                res.render('auth/login', { errorMsg: 'Contraseña incorrecta' })
                return
            }
        })
})

// Login checker
router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render("auth/login", { errorMsg: 'Área restringida! Necesitas acceder con tu cuenta!' })
    }
})


/* GET private page */
router.get('/private', (req, res) => res.render('private'))

// Logout
router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect("/iniciar-sesion"))
})



module.exports = router;
