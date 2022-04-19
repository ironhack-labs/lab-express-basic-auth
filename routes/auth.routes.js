const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { isLoggedOut } = require('./../middleware/route-guard')

const User = require('../models/User.model')

router.get('/signup', isLoggedOut,(req,res) => {
    res.render('auth/signup')
})

router.post('/signup', isLoggedOut, (req,res,next) => {
    const {username, plainPassword} = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPassword => User.create({username, password: hashedPassword}))
        .then(() => res.redirect('/login'))
        .catch(error => next(error))
})
    


router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.post('/login', isLoggedOut, (req,res,next) => {
    const {username, plainPassword} = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'Fill out all fields' })
        return
    }

    User
        .findOne({username})
        .then(user => {
            if (!user) {
                res.render('auth/login', {errorMessage: 'Usuario no reconocido' })
                return
            }

            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('auth/login', { errorMessage: 'Contraseña no válida' })
                return
            }

            req.session.currentUser = user          // <= THIS means logging in a user
            res.redirect('/profile')
        })
        .catch(error => next(error))
})

router.post('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router