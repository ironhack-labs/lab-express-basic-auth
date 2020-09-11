const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.model');

const bcryptSalt = 10;

// Registro de usuario
router.get('/registro', (req, res) => res.render('signup-form'))
router.post('/registro', (req, res) => {

    const { username, password } = req.body;
    
    if (password.length < 8) {
        res.render('signup-form', { errorMessage: 'La contraseña tiene que tener minimo 8 caracteres.' })
        return
    }

    User.findOne({ username })
        .then(theFoundUser => {

            if (theFoundUser) {
                res.render('signup-form', { errorMessage: 'Usuario ya registrado' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(err => console.log('Error: ', err))
        })
        .catch(err => console.log('Error :', err))
})


// Inicio de sesión

router.get('/iniciar-sesion', (req, res) => res.render('login-form'))
router.post('/iniciar-sesion', (req, res) => {
    const { username, password } = req.body;

    if (username === '' || password === '') {
        res.render('login-form', { errorMessage: 'Rellena los campos Merluzo!!' })
        return
    }

    User.findOne({ username })
        .then(theFoundUser => {
            if (!theFoundUser) {
                res.render('login-form', { errorMessage: 'Usuario no registrado.' })
                return
            }
            if (bcrypt.compareSync(password, theFoundUser.password)) {
                req.session.currentUser = theFoundUser;
                res.redirect('/')
            } else {
                res.render('login-form', { errorMessage: 'Contraseña incorrecta :3'})
            }
        })
        .catch(err => console.log('Error : ', err))
})

router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/iniciar-sesion'))
})


module.exports = router; 