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

module.exports = router;