const express = require('express');
const router = express.Router();
//Añadimos el modelo
const User = require('../models/User');
//requerimos el bcrypt
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

router.get('/', (req, res, next) => {
    res.render('home')
});

//Ruta de registro
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});


//Registrar usuario
router.post('/signup', (req, res, next) => {
    const { username, password, repeatPassword } = req.body;
    console.log(username);
    console.log(password);
    console.log(repeatPassword);
    if (username === "" | password === "" | repeatPassword === "") {
        res.render("auth/signup", {
            errorMessage: "Por favor rellene todos los campos"
        });
    }
    if (password !== repeatPassword) {
        res.render("auth/signup", {
            errorMessage: "Por favor los campos de los passwords deben de ser iguales."
        });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (user !== null) {
                res.render('auth/signup', {
                    errorMessage: '¡El usuario ya existe!'
                });
                return;
            }
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({
                    username,
                    password: hashPass
                }).then(() => {
                    res.redirect('/');
                })
                .catch(error => {
                    console.log(error);
                })

        })
        .catch(error => {
            next(error);
        })
})

//Ruta de login
router.get('/login', (req, res, next) => {
    res.render('auth/login')
});
//Login
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    if (username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Porfavor introduzca los dos campos"
        });
        return;
    }
    // console.log('Primer If');
    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', {
                    errorMessage: "El usuario no existe"
                });
                return;
            }
            // console.log('Segundo If Password', password);
            // console.log('Segundo If User.Password', user.password);
            if (bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;
                // console.log("estoy aquí");
                res.redirect('/main');
            } else {
                res.render("auth/login", {
                    errorMessage: "Password Incorrecto"
                });
            }
        })
        .catch(error => {
            next(error);
        });
});
router.get("/logout", (req, res, next) => {
    req.session.destroy(err => {
        // cannot access session here
        res.redirect("/");
    });
});


module.exports = router;