const express = require('express')
const router = express.Router()

const User = require('./../models/User.model')

const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { isLoggedOut } = require('./../middleware/route-guard')


//Signup Route

router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', isLoggedOut, (req, res) => {

    const { email, plainPassword, name } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(plainPassword, salt)
        })
        .then(hashedPassword => {
            return User.create({ email, password: hashedPassword, name })
        })
        .then(() => res.redirect('/login'))
        .catch(err => console.log('HOLAHOLA', err))
})


//Login Route

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.post('/login', isLoggedOut, (req, res) => {

    const { email, plainPassword, name } = req.body

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Chacho ese no es el Email' })
                return
            }
            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('auth/login', { errorMessage: 'Chacho Usuario Cremita pero password jodida' })
                return
            }
            req.session.currentUser = user
            res.redirect('/main')
        })
        .catch(err => console.log(err))
})

//Logout Route

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'))
})


module.exports = router // EXPORTAR HOJA DE RUTAS PARA LA APP