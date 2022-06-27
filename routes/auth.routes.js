const router = require("express").Router()
const User = require("../models/User.model")

const bcryptjs = require("bcryptjs")
const saltRounds = 10

// Aqui tengo que meter luego el middleware:
//const { isLoggedOut } = require("../middleware/session-guard");



router.get("/registro", (req, res) => {

    res.render("auth/signup")
})

router.post("/registro", (req, res) => {

    const { username, email, password: plainPassword } = req.body
    //console.log("Esto NUNCA debe ir a la BBDD", plainPassword)
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPwd => User.create({ username, email, password: hashedPwd }))
        .then(() => res.redirect("/"))
        .catch(err => console.log(err))
})

router.get('/inicio-sesion', (req, res) => {
    res.render('auth/login')
})

router.post("/inicio-sesion", (req, res) => {
    const { email, password: plainPassword } = req.body
    if (email.length === 0 || plainPassword.length === 0) {
        res.render("auth/login", { errorMessage: 'Los campos son obligatorios' })
        return
    }

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Ese usuario no es' })
                return
            }
            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña mal' })
                return
            }
            req.session.currentUser = user
            res.redirect("/mi-perfil")
        })
        .catch(err => console.log(err))
})

router.post('/cerrar-sesion', (req, res) => {
    req.session.destroy()
    res.redirect('/inicio-sesion')
})


module.exports = router;