// requerir router y bcryptjs
const router = require("express").Router()
const bcryptjs = require('bcryptjs')
const app = require("../app")

//requerir modelo
const User = require('./../models/User.model')

// saltRounds
const saltRounds = 10



// 5 RUTAS - 2 REGISTER, 2 LOGIN, 1 LOGOUT

// registro -- render formulario
router.get('/registro', (req, res, next) => {
    res.render('auth/signup-form')
})

// registro -- envío formulario
router.post('/registro', (req, res, next) => {
    // necesito la info del formulario
    const { username, plainPwd } = req.body

    // comprobar campos vacíos y usuarios ya registrados
    if (username.length === 0 || plainPwd.length === 0) {
        res.render('auth/signup-form', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .find()
        .then(allUsers => {
            allUsers.forEach(elm => {
                if (elm.username === username) {
                    res.render('auth/signup-form', { errorMessage: 'Usuario ya registrado' })
                    return
                }
            })
        })

    bcryptjs
        .genSalt(saltRounds) // generar sal
        .then(salt => bcryptjs.hash(plainPwd, salt)) // hashear
        .then(hashedPwd => {
            // crear nuevo usuario
            return User.create({ username, password: hashedPwd })

        })
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})



// login -- render formulario
router.get('/login', (req, res) => {
    res.render('auth/login-form')
})

// login -- envío formulario
router.post('/login', (req, res, next) => {
    // coger info del formulario
    const { username, plainPwd } = req.body

    // comprobar que no estén vacíos (añadimos el helper condicional en hbs para el error)
    if (username.length === 0 || plainPwd.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Rellena todos los campos' })
        return
    }

    // con el modelo, encontrar el usuario, comprobar que existe, comparar contraseñas, iniciar sesion
    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login-form', { errorMessage: 'Usuario no registrado' })
                return
            } else if (bcryptjs.compareSync(plainPwd, user.password) === false) {
                res.render('auth/login-form', { errorMessage: 'Contraseña Incorrecta' })
                return
            } else {
                req.session.currentUser = user          // inicia la sesión del usuario
                res.redirect('/main')
            }
        })

})


// extra logout
router.get('/logout', (req, res, next) => {
    if (req.session.currentUser) {
        req.session.destroy(() => res.redirect('/'))
    }
})

// exportar router!!
module.exports = router