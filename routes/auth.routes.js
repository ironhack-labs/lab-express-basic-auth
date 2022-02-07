const router = require("express").Router()
const bcryptjs = require("bcryptjs")

const User = require('./../models/User.model')
const rounds = 10

router.get("/registro", (req, res, next) => res.render("auth/signup-form"))

router.post("/registro", (req, res, next) => {

    const { username, email, userPwd } = req.body

    bcryptjs
        .genSalt(rounds)
        .then(salt => bcryptjs.hash(userPwd, salt))
        .then(hashPassword => {
            console.log('El hash a crear en la BBDD es', hashPassword)
            return User.create({ username, email, passwordHash: hashPassword })
        })
        .then(createdUser => res.redirect("/"))
        .catch(error => next(error))
})

router.get("/inicio-sesion", (req, res, next) => res.render("auth/login-form"))

router.post("/inicio-sesion", (req, res, next) => {

    const { email, userPwd } = req.body

    if (email.length === 0 || userPwd.length === 0) {
        res.render("auth/login-form", { errorMessage: "Rellena todos los campos" })
        return
    }

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render("auth/login-form", { errorMessage: "Email no registrado" })
                return
            } else if (bcryptjs.compareSync(userPwd, user.passwordHash) === false) {
                res.render("auth/login-form", { errorMessage: "Contraseña incorrecta" })
                return
            } else {
                req.session.currentUser = user
                res.redirect("/perfil")
            }
        })

})

router.post("/cerrar-sesion", (req, res) => {
    req.session.destroy(() => res.redirect("/inicio-sesion"))
})

module.exports = router
