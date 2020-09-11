const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")

const User = require("../models/user.model")

const bcryptSalt = 10


// Formulario de registro
router.get("/register", (req, res) => res.render("signup-form"))
router.post("/register", (req, res) => {
    
    const { username, password } = req.body
    
    User.findOne({ username })
        .then(foundUser => {
            if (foundUser) {
                res.render("signup-form", { errorMessage: "El nombre de usuario ya está siendo utilizado" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)
            
            User.create({ username, password: hashPass })
                .then(() => res.redirect("/"))
                .catch(err => console.log(err))
        })
        .catch(err => console.log('error:', err))
})


// Formulario para Inicio de Sesión

router.get("/login", (req, res) => res.render("login-form"))
router.post("/login", (req, res) => {
    console.log(req.body)
    const { username, password } = req.body
    
    if (username === "" || password === "") {
        res.render("login-form", { errorMessage: "No se admiten hombres invisibles" })
        return
    }

    User.findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render("login-form", { errorMessage: "Usuario incorrecto" })
                return
            }
            
            if (bcrypt.compareSync(password, foundUser.password)) {
                req.session.currentUser = foundUser
                res.redirect("/profile")
            } else {
                res.render("login-form", {errorMessage: "Contraseña incorrecta"})
            }
        })
        .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect("/login"))
})

module.exports = router