const router = require('express').Router()
const bcryptjs = require('bcryptjs')

const User = require('./../models/User.model')

const saltRounds = 10


//Signup from (render)

router.get('/registro', (req, res, next) => {
    res.render('auth/signup-form')
})

//Signup from (handle)

router.post('/registro', (req, res, next) => {

    const { username, password } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            console.log('El hash a crear en la BBDD es', hashedPassword)
            return User.create({
                username,
                password: hashedPassword
            })
                .then(createUser => res.redirect('/')
                )
                .catch(error => next(error))
        })
})




//Log in form (render)

router.get('/inicio-sesion', (req, res, next) => {
    res.render('auth/login-form')
})

//Log in form (handle)

router.post('/inicio-sesion', (req, res, next) => {
    const { username, password } = req.body

    if (username.lenght === 0 || password.lenght === 0) {
        res.render('auth/login-form', {
            errorMessage: 'Por favor, rellena todos los campos'
        })
        return
    }

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login-form', { errorMessage: 'Usuario no registrado en la Base de Datos' })
                return
            } else if (bcryptjs.compareSync(password, user.password) === false) {
                res.render('auth/login-form', { errorMessage: 'La contraseña es incorrecta' })
                return
            } else {
                req.session.currentUser = user
                console.log('El objeto de EXPRESS-SESSION', req.session)
                res.redirect('/perfil')
            }

        })
})




module.exports = router

