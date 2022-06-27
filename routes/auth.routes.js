const router = require("express").Router();
const User = require("./../models/User.model")

const { isLoggedIn, isLoggedOut } = require('./../middleware/session-guard')

const bcryptjs = require("bcryptjs");
const saltRounds = 10

// METER MIDDLEWARES

router.get('/registro', isLoggedOut, (req, res) => {
    res.render('auth/register')
})

router.post('/registro', isLoggedOut, (req, res) => {

    const { username, password: plainPassword } = req.body

    console.log(plainPassword)

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPwd => User.create({ username, password: hashedPwd }))
        .then(() => res.redirect('/'))
        .catch(e => console.log(e))
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
            console.log(user)

            if (!user) {
                res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
                return
            }


            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('auth/login', { errorMessage: 'Contraseña no válida' })
                return
            }

            req.session.currentUser = user

            console.log(req.session.currentUser)

            res.redirect('/')

        })
        .catch(e => console.log(e))

})

router.get('/main', isLoggedIn, (req, res) => {
    res.render('auth/cat')
})

router.get('/private', isLoggedIn, (req, res) => {
    res.render('auth/private')
})

router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy()
    res.redirect('/inicio-sesion')
})

module.exports = router