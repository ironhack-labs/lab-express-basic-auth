const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { isLoggedOut } = require('../middlewares/route-guard')

const User = require('../models/User.model')

const saltRounds = 10

router.get('/register', isLoggedOut, (req, res) => res.render('auth/signup-form'))

router.post('/register', (req, res) => {
    const { username, email, password } = req.body

    if (username.length === 0 || email.length === 0) {
        res.render('auth/signup-form', { errorMessage: 'Fill all the fields MOTHERFUCKER' })
        return
    }

    // if (User.exists({ username })) {
    //     res.render('auth/signup-form', { errorMessage: 'This username is already used' })
    //     return
    // }   

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(passwordHash => User.create({ username, email, password: passwordHash }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})

router.get('/log-in', isLoggedOut, (req, res) => res.render('auth/login-form'))

router.post('/log-in', (req, res) => {
    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Fill all the fields MOTHERFUCKER' })
        return
    }

    User
        .findOne({ email })
        .then(user => {

            if (!user) {
                res.render('auth/login-form', { errorMessage: 'Usuario no registrado' })
            }
            else if (!bcrypt.compareSync(password, user.password)) {
                res.render('auth/login-form', { errorMessage: 'Datos incorrectos (es la pwd...)' })
            }
            else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
})

router.get('/log-out', (req, res) => req.session.destroy(() => res.redirect('/')))



module.exports = router