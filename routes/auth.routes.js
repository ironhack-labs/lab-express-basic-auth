const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const { isLoggedOut } = require("../midellware/router-guard");
const saltRounds = 10
const User = require('../models/User.model')

router.get('/registro', (req, res) => {
    res.render('auth/signup')
})

router.post('/registro', (req, res, next) => {
    const { username, password } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect('/'))
        .catch(error => next(error));
})

router.get('/inicio-sesion', (req, res, next) => {
    res.render('auth/login')
})

router.post('/inicio-sesion', (req, res, next) => {
    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('/', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (!bcryptjs.compareSync(password, user.password)) {
                res.render('/', { errorMessage: 'Contraseña no válida' })
                return
            }

            req.session.currentUser = user // <= THIS means logging in a user
            res.redirect('/mi-perfil')
        })
        .catch(error => next(error));
})


router.post('/cerrar-sesion', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})






module.exports = router;