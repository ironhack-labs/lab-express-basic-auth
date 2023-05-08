const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const { isLoggedIn } = require('../middlewares/route-guard') // requerimos la ruta del middleware para que se nos protejan las vistas que queramos para solo poder entrar con log in

const { isLoggedOut } = require('../middlewares/route-guard')  // requerimos la ruta para el loggout

const User = require('./../models/User.model')


// signup form (render)
router.get("/registro", (req, res, next) => {
    res.render("auth/signup")
})

//signup form (handler)


router.post("/registro", (req, res, next) => {

    const { username, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))

})

//login form (render)

router.get("/inicio-sesion", isLoggedOut, (req, res, next) => {    //al meter el log out solo nos deja si no estamos logeados
    res.render("auth/login")
})


//login form post (handling)

router.post("/inicio-sesion", (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Los campos son obligatorios' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }

            req.session.currentUser = foundUser // si esto se cumple nos estamos logeando
            res.redirect('/') //lo redirijo al inicio
        })
})


// aquí vamos a crear la ruta protegida para solo login

router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("main")
})

//creamos la otra ruta protegida que nos deriva a otra parte

router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("private")
})


//creamos la ruta para el log out

router.get('/desconectar', isLoggedOut, (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})



module.exports = router