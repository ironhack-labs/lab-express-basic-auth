const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

const User = require('../model/user.model');
const app = require('./../app');

// renderiza el get sign up

router.get('/signup', (req, res) => {
    res.render('signup')
});

// renderiza el post sign up

router.post('/signup', (req, res) => {

    const { username, password } = req.body;

    if (username === "" || password === "") {
        res.render('signup', { errorMsg: 'Rellenar usuario y contraseña' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {
            if (theUser) {
                res.render('signup', { errorMsg: 'Usuario ya registrado' })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User
                .create({ username, password: hashPass })
                .then(() => res.render('index', { successMsg: 'Registro completado' }))
                .catch(err => console.log(err))
        })
})

// renderiza el get login

router.get('/login', (req, res) => {
    res.render('login')
});

// renderiza el post login 

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    if (username === "" || password === "") {
        res.render('login', { errorMsg: 'Rellenar usuario y contraseña' })
        return
    }
    
    User
        .findOne({ username })
        .then(theUser => {

            if (!theUser) {
                res.render('login', { errorMsg: "No existe usuario" })
                return
            }

            if (!bcrypt.compareSync(password, theUser.password)) {
                res.render('login', { errorMsg: "Contraseña incorrecta" })
                return
            }


            req.session.currentUser = theUser;
            res.render('index', { successMsg: '¡Bienvenid@,' + theUser.username + '!' })
        })

})


module.exports = router