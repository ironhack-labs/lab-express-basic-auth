const router = require("express").Router()
const bcryptjs = require('bcryptjs')
const req = require("express/lib/request")
const { render } = require("express/lib/response")

const User = require('./../models/User.model')
const saltRounds = 10


// -----------------------------------------------------------------------------


// Signup form render
router.get("/register", (req, res, next) => res.render("auth/signup-form"))

// Signup form handler
router.post("/register", (req, res, next) => {
    const { username, userPwd } = req.body
    console.log(req.body)

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(userPwd, salt))
        .then(hashedPassword => {
            return User.create({ username, passwordHash: hashedPassword })
        })
        .then(() => res.redirect('/'))
        .catch(error => next(error))
})



// -----------------------------------------------------------------------------



//Login form render
router.get("/signup", (req, res, next) => res.render("auth/login-form"))

// Login form handler
router.post("/signup", (req, res, next) => {

    const { username, userPwd } = req.body

    if (username.length === 0 || userPwd.length === 0) {
        res.render("auth/login-form", { errorMessage: 'Por favor, rellena todos los campos' })
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render("auth/login-form", { errorMessage: "Usuario no registrado en la base de datos" })
                render
            } else if (bcryptjs.compareSync(userPwd, user.passwordHash) === false) {
                res.render("auth/login-form", { errorMessage: "Contraseña incorrecta" })
                return
            } else {
                req.session.currentUser = user
                res.redirect("/main")
            }
        })
})


// -----------------------------------------------------------------------------



router.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})



module.exports = router