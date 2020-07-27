const express = require('express');
const router = express.Router();

//IT-1 Requiero el modelo de User
const User = require('../models/User.model')

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

//IT-1 Renderiza el hbs cuando se visita /signup
router.get('/signup', (req, res, next) => res.render('auth/signup.hbs'));

//IT-1 Ruta POST para coger la info del form /signup
router.post('/signup', (req, res, next) => {
    //Recojo los valores del form
    const {
        username,
        password
    } = req.body;
    //Bonus-1: si los campos están vacíos, renderizo /sign
    if (username === "" || password === "") {
        res.render("auth/signup.hbs", {
            errorMessage: "Add a username and password"
        });
        return;
    };

    //IT-1 Busco si existe el usuario

    User.findOne({
            username
        })
        .then((user) => {
            if (user !== null) {
                res.render('auth/signup', {
                    errorMessage: "Username already exists"
                });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({
                    username,
                    password: hashPass
                })
                .then(() => {
                    res.redirect('/')
                })
                .catch((error) => {
                    console.log('Error while saving the user in the DB', err)
                })
        })
        .catch((error) => {
            next(error);
        });
})

//IT-2 Renderiza el hbs cuando se visita /login
router.get('/login', (req, res, next) => res.render('auth/login.hbs'));

router.post('/login', (req, res, next) => {
    //Guardo la info del form login en estas variables
    const {
        username,
        password
    } = req.body;

    //Bonus
    if (username === "" || password === "") {
        res.render('auth/login.hbs', {
            errorMessage: "Username or password missing, try again"
        });
        return;
    }

    //Busco al usuario en la DB
    User.findOne({
            username
        })
        .then((user) => {
            //Si no hay user, render login y enseño error de que no existe
            if (!user) {
                res.render('auth/login', {
                    errorMessage: "This user doesn't exist, feel free to register with it"
                });
                return;
            }
            //Si hay usuario, debe comparar la contraseña del form (passowrd, texto plano),
            //con la contraseña de la DB (user.password, encriptada)
            //Para comparar las dos passwords, se usa compareSync, que acepta como primer
            //argumento la password del form y como segundo la password encriptada de la DB
            if (bcrypt.compareSync(password, user.password)) {
                //Esta función también guarda el login en la session
                req.session.currentUser = user;
                res.redirect('/');
            } else {
                res.render('auth/login', {
                    errorMessage: 'Incorrect password'
                })
            }
        })
        .catch(error => {
            next(error)
        })
})
module.exports = router;