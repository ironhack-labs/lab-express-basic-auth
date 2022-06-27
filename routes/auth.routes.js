const router = require("express").Router()
const User = require("./../models/User.model")

const bcryptjs = require("bcryptjs");
const { isLoggedIn } = require("../middleware/session-guard");
const saltRounds = 10



router.get("/registro", (req, res) => {

    res.render("auth/signup")

})

router.post("/registro", (req, res) => {

    const { username, password: pasEncrypted } = req.body
    console.log("esto no debe salir, ", username)

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(pasEncrypted, salt))
        .then(hashedPwd => User.create({ username, password: hashedPwd }))
        .then(() => res.redirect("/"))
        .catch(err => (console.log(err)))

})

router.get('/login', (req, res) => {

    res.render('auth/login')
})

router.post('/login', (req, res) => {

    const { username, password: pasEncrypted } = req.body

    if (username.length === 0 || pasEncrypted.length === 0) {

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

            if (bcryptjs.compareSync(pasEncrypted, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña no válida' })
                return
            }

            req.session.currentUser = user
            res.redirect('/mi-perfil')
        })
        .catch(err => console.log(err))
})

router.get('/private', isLoggedIn, (req, res) => {
    res.render('user/private', { userInSession: req.session.currentUser })
})

router.get('/main', isLoggedIn, (req, res) => {
    res.render('user/main', { userInSession: req.session.currentUser })
})

router.post('/cerrar-sesion', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})


module.exports = router;