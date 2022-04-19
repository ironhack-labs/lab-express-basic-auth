const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { isLoggedOut } = require('./../middleware/route-guard')

const User = require('../models/User.model')

//REGISTRARSE

router.get('/signup', isLoggedOut, (req, res) => {
    res.render('signup')
})

router.post('/signup', isLoggedOut, (req, res, next) => {

    const { username, plainPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect('/login'))
        .catch(error => next(error));
})

module.exports = router;


//INICIAR SESIÓN

router.get("/login", isLoggedOut, (req, res) => {
    res.render("login")
})


router.post('/login', isLoggedOut, (req, res, next) => {

    const { username, plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render("login", { errorMessage: "Rellena todos los campos" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render("login", { errorMessage: "Usuario no reconocido" })
                return
            }

            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('login', { errorMessage: "Contraseña no válida" })
                return
            }

            req.session.currentUser = user
            res.redirect("/")
        })
        .catch(error => next(error));
})

//