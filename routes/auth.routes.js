const router = require("express").Router()
const bcryptjs = require('bcryptjs')

const User = require('../models/User.model')
const saltRounds = 10

router.get("/registro", (req, res, next) => res.render("auth/sign-up-form"))

router.post("/registro", (req, res, next) => {
    const { username, userPwd } = req.body

    console.log(req.body)

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(userPwd, salt))
        .then(hashedPassword => {
            console.log('El hash que hay que crear en la BBDD es', hashedPassword)
            return User.create({ username, userPwd: hashedPassword })
        })
        .then(createdUser => res.redirect('/'))
        .catch(error => next(error))

})

router.get("/iniciar-sesion", (req, res, next) => res.render("auth/login-form"))
router.post("/iniciar-sesion", (req, res, next) => {
    const { username, userPwd } = req.body

    if (username.length === 0 || userPwd.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Te falta rellenar algún campo' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user === false) {
                res.render("auth/login-form", { errorMessage: 'Este usuario no se encuentra en la BBDD' })
                return
            } else if (bcryptjs.compareSync(userPwd, user.password) === false) {
                res.render("auth/login-form", { errorMessage: 'Esta contraseña no existe' })
                return
            } else {
                console.log(req.session)
                req.session.currentUser = user

                res.redirect('/profile')
            }

        })


})

module.exports = router;