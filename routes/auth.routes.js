const router = require("express").Router();
const User = require("./../models/User.model")

const bcryptjs = require("bcryptjs");
const saltRounds = 10

const { isLoggedOut } = require("../middleware/session-guard");


router.get("/registro", isLoggedOut, (req, res) => {
    res.render("auth/register")
})

router.post("/registro", isLoggedOut, (req, res) => {

    const { username, password: plainPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPwd => User.create({ username, password: hashedPwd }))
        .then(() => res.redirect("/"))
        .catch(err => console.log(err))
})


router.get("/login", isLoggedOut, (req, res) => {
    res.render("auth/login")
})


router.post('/login', isLoggedOut, (req, res) => {

    const { username, password: plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'Rellene ambos' })
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

            req.session.currentUser = user        // Inicio de sesión
            res.redirect('/')
        })
        .catch(err => console.log(err))
})

router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

module.exports = router
