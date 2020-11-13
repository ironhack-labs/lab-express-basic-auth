const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const bcryptSalt = 10

const User = require('../models/user.model')

const app = require('../app')


// Endpoints
router.get('/registro', (req, res) => res.render('signup'))

router.post('/registro', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.render('signup', { errorMsg: 'Por favor introduce usuario y contraseña' })
        return
    }

    if (password.length < 6) {
        res.render('login', { errorMsg: 'La contraseña debe tener más de 6 caracteres' })
        return
    }
    
    User
        .findOne({username})
        .then(theUser => {
            if (theUser) {
                res.render('signup', { errorMsg: 'Usuario ya registrado' })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(err => console.log(err))
        })
        .catch(err => console.log('There was and error:', err))
    
})



router.get('/iniciar-sesion', (req, res) => res.render('login'))

router.post('/iniciar-sesion', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.render('login', { errorMsg: 'Por favor introduce usuario y contraseña' })
        return
    }

    if (password.length < 6) {
        res.render('login', { errorMsg: 'La contraseña debe tener más de 6 caracteres' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {
            if (!theUser) {
                res.render('login', { errorMsg: 'Introduce un usuario válido' })
                return
            }

            if (!bcrypt.compareSync(password, theUser.password)) {
                res.render('login', { errorMsg: 'Contraseña errónea' })
                return
            }
            
            req.session.currentUser = theUser

            res.render('profile', { theUser })

        })
        .catch(err => console.log(err))

})

router.get('/cerrar-sesion', (req, res) => req.session.destroy((err) => res.redirect('/')))

module.exports = router
