const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const bcryptSalt = 10

const User = require('./../models/user.model')
const app = require('../app')


router.get('/registro', (req, res) => res.render('auth/signup-form'))

router.post('/registro', (req, res) => {

    const { username, password } = req.body

      if (username.length === 0 || password.length === 0) {
        res.render('auth/signup-form')
        return
    }
    
    User
        .findOne({ username: username })
        .then(theUser => {
            if (theUser) {
                res.render('auth/signup-form')
                return
            }
             console.log(theUser)
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.render('index'))
                .catch(err => console.log(err))
        })

})


router.get('/iniciar-sesion', (req, res) => res.render('auth/login-form'))

router.post('/iniciar-sesion', (req, res, next) => {

    const { username, password } = req.body
if (username.length === 0 || password.length === 0) {
        res.render("auth/main")
        return
    }

    User
        .findOne({ username: username })
        .then(theUser => {console.log()

            if (!theUser) {
                res.render("auth/main")
                return
            }

            module.exports = router
            if (!bcrypt.compareSync(password, theUser.password)) {
                res.render("auth/main")
                return
            }

            req.session.currentUser = theUser     
            console.log('popino')
            res.render('auth/private')
        })
        .catch(err => console.log(err))
})

module.exports = router