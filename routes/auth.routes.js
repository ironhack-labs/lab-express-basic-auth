const router = require("express").Router();
const User = require("./../models/User.model")
const bcryptjs = require("bcryptjs");
const saltRounds = 10

const { isLoggedOut } = require("../middelware/session-guard");

router.get('/registro', isLoggedOut, (req, res) => {
    res.render('auth/register')
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

router.get('/inicio-sesion', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.post('/inicio-sesion', isLoggedOut, (req, res) => {

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

            req.session.currentUser = user
            res.redirect('/mi-perfil')
        })
        .catch(err => console.log(err))
})

router.post('/cerrar-sesion', (req, res) => {
    req.session.destroy()
    res.redirect('/inicio-sesion')
})



module.exports = router
