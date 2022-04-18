const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { isLoggedOut } = require('./../middleware/route-guard')

const User = require('../models/User.model')

//Crear get para formulario
router.get('/registro', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

// Resgistrarse y crea en base de datos
router.post('/registro', isLoggedOut, (req, res, next) => {


    const { username, plainPassword } = req.body

    // res.send(req.body)

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect('/inicio-sesion'))
        .catch(error => next(error));
})


//Iniciar sesion
router.get('/inicio-sesion', isLoggedOut, (req, res) => {
    // res.send('funciona')
    res.render('auth/login')

})

//Entrar en el perfil con errores
router.post('/inicio-sesion', (req, res, next) => {

    const { username, plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'Fill all' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Unknown user' })
                return
            }

            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('auth/login', { errorMessage: 'invalid password' })
                return
            }

            req.session.currentUser = user       
            res.redirect('/mi-perfil')
        })
        .catch(error => next(error));
})



router.post('/cerrar-sesion', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})



module.exports = router;
