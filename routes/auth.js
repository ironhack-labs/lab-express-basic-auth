const express = require("express");
const router = express.Router();

// User model

const User = require("../models/User.model");

// Bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcrypSalt = 10;

//GET ruta signup para la vista
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

/* 
1.POST ruta signup para traer los valores del formulario. Con el req.body cogemos los valores del form y
los pasa como constantes
*/

router.post("/signup", (req, res, next) => {
    const {
        username,
        password
    } = req.body;

    //validamos si el formulario está lleno:
    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and a password to sign up",
        });
        return;
    }

    User.findOne({
            username
        })
        .then((user) => {
            if (user !== null) {
                res.render('auth/signup', {
                    errorMessage: 'The username already exists',
                });
                return;
            }
            const salt = bcrypt.genSaltSync(bcrypSalt);
            const hashPass = bcrypt.hashSync(password, salt);


            User.create({
                    username,
                    password: hashPass
                })
                .then(() => {
                    res.redirect('/');
                })

                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            next(error);
        });
});



//SignUp

router.get('/login', (req, res, next) => {
    res.render('auth/login')
})



router.post('/login', (req, res, next) => {
    //traemos a una variable los datos del formulario
    const {
        username,
        password
    } = req.body;

    //verificamos que los datos del formulario no lleguen vacios
    if (username === "" || password === "") {
        res.render('auth/login', {
            errorMessage: 'Please enter both, username and password to login'
        })
        return;
    }

    /*buscamos en la base de datos si existe un username con los datos del login que vienen del form
    1. Si no lo encuentra, nos dice que el usuario no existe
    2. Si lo encuentra, nos devuelve el user
    Usamos el método compareSync para hacer el hash del form input y compararlo con el password guardado en la base de datos
    */


    User.findOne({
            username
        })
        .then((user) => {
            if (!user) {
                res.render('auth/login', {
                    errorMessage: "The username doesn't exists"
                })
                return;
            }

            if (bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.redirect('/')
            } else {
                res.render('auth/login', {
                    errorMessage: 'Incorrect password'
                })
            }
        })
        .catch((error) => {
            next(error)
        })
})



module.exports = router;