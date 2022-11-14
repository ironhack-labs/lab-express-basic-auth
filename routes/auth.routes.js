const express = require('express');
const router = express.Router();

const User = require('./../models/User.model')

const bcryptjs = require('bcryptjs');
const saltRounds = 10
// SaltRounds - ralentiza el servidor - aqui estamos encriptando 

const { isLoggedOut, isLoggedIn } = require('../middleware/route-guard');

// ********************************

// Signup - Form - (render)

router.get('/register', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

// le estamos diciendo que renderice el view que esta en auth cuando sea /register

// Sign up - Form - (handle)
router.post('/register', isLoggedOut, (req, res) => {

    const { username, plainPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {

            return bcryptjs.hash(plainPassword, salt)
        })

        .then(hashedPassword => {
            return User.create({ username, password: hashedPassword })
        })
        .then(() => res.redirect('/log-in-process'))

        .catch(err => console.log(err))
})

// Login - Form-  (render)

router.get('/log-in-process', isLoggedOut, (req, res) => {
    res.render('auth/login')
})


// Login - Form-  (handle)
router.post('/log-in-process', isLoggedOut, (req, res) => {
    const { username, plainPassword } = req.body

    User

        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'User Not Found' })
                return
            }
            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Wrong Password' })
                return
            }

            req.session.currentUser = user      // login
            res.redirect('/profile')
        })

        .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/log-in-process'))
})


module.exports = router

// Siempre debo exportar 

// 1. Gen salt = Creame la sal 2. Dame la sal 3. Devuelveme la password hasheada 
// en este punto cuando lo mandes te va a redirigir a una pag que no existe porque no la has creado pero sabes que la vas a crear 
// 2. Si le pongo         // .then((usertry) => res.send(usertry)) como ya tiene la extension me va a mostrar el objeto :3
// ********************************
