const router = require("express").Router();
const User = require("./../models/User.model")

const bcryptjs = require("bcryptjs");
const saltRounds = 10

router.get("/registro", (req, res, next) => {
    //res.send("no arriesgo")
    res.render("auth/signup")
})

router.post("/registro", (req, res, next) => {
    const { username, password: plainPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPwd => User.create({ username, password: hashedPwd }))
        .then(() => res.redirect("/"))
        .catch(err => console.log(err))
})

router.get("/inicio-sesion", (req, res, next) => {
    res.render("auth/login")
})

router.post("/inicio-sesion", (req, res, next) => {
    const { username, password: plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'Los campos son obligatorios' })
        return
    }

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña no válida' })
                return
            }

            req.session.currentUser = user          // Inicio de sesión
            res.redirect('/private')
        })
        .catch(err => console.log(err))
})






module.exports = router;