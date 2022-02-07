const router = require("express").Router()
const bcryptjs = require("bcryptjs")

const User = require("../models/User.model")
const saltRounds = 10


// SIGN UP FORM
router.get("/registro", (req, res, next) => {
    res.render("auth/signup-form")
})

router.post("/registro", (req, res, next) => {
    const { username, userPwd } = req.body

    bcryptjs
            .genSalt(saltRounds)
            .then(salt => bcryptjs.hash(userPwd, salt))
            .then(hashedPassword => {
                console.log("Hashed Password: ", hashedPassword)
                return User
                        .create({ username, password: hashedPassword })
            })
            .then(() => res.redirect("/"))
            .catch(error => next(error))
})


// LOGIN FORM

router.get("/inicio-sesion", (req, res, next) => {
    res.render("auth/login-form")
})

router.post("/inicio-sesion", (req, res, next) => {
    const { username, userPwd} = req.body

    if (!username.length || !userPwd.length) {
        res.render("auth/login-form", {errorMessage: "Rellena todos los datos"})
        return
    }

    User
        .findOne({username})
        .then(user => {
            if (!user) {
                res.render("auth/login-form", {errorMessage: "Usuario no existe en la base de datos"})
                return
            } else if(bcryptjs.compareSync(userPwd, user.password) === false) {
                res.render("auth/login-form", {errorMessage: "Contraseña Incorrecta"})
                return
            } else {
                req.session.currentUser = user
                res.redirect("/perfil")
            }
        })

})


// LOG OUT  

router.post("/cerrar-sesion", (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/inicio-sesion")
    })
})

module.exports = router