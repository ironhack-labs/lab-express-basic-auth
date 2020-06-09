const { Router } = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');

const router = new Router();
const saltRounds = 10;

/* RUTAS SIGNUP */

router.get('/signUp', (req, res) => res.render('auth/signup'));

router.post('/signUp', async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        //Comprobación de campos completados
        if (!username || !email || !password) {
            res.render('auth/signup', {errorMessage: 'Username, email and and password inputs are mandatory'});
        }
        //Comprobación seguridad password
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!regex.test(password)) {
            res.status(500).render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars, at least one number, one lowercase and one uppercase letter.' });
        }
        //Generación hashed password
        const salt = await bcryptjs.genSalt(saltRounds);
        const hashedPassword = await bcryptjs.hash(password, salt);
        //Crear usuario
        const user = await User.create({
            username: username,
            email: email,
            passwordHash: hashedPassword
        })
        //Creamos la sesión del nuevo usuario y redireccionamos a su perfil
        req.session.currentUser = user;
        res.redirect('/userProfile');
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).render('auth/signup', {errorMessage: error.message});
        } else if (error.code === 11000) {
            res.status(400).render('auth/signup', {errorMessage: 'Username or email are already registered...'});
        } else {
            next(error);
        }
    }
})

/* RUTAS LOGIN */

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //Comprobación de datos vacíos
        if (email === '' || password === '') {
          res.render('auth/login', {
            errorMessage: 'Please enter both, email and password to login.'
          });
        }
        //Buscar usuario, comprobar su existencia y contraseña
        const user = await User.findOne({email})
        if (!user) {
            res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {   
            req.session.currentUser = user;
            res.redirect('/userProfile');
        } else {
            res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
    } catch (error) {
        console.log(error)
    }
})

/* RUTAS USERPROFILE */

router.get('/userProfile', async (req, res) => {
    const user = req.session.currentUser;
    res.render('users/user-profile', {user});
});

/* RUTAS LOGOUT */

router.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;