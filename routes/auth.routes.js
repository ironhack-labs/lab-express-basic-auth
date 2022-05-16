// RECORDATORIO Hay diferentes maneras de llegar al mismo resultado :)
// const express = require("express")
// const mirouter = express.Router()
// mirouter.get("/")

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User.model')
const mongoose = require("mongoose")
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

// 1.- Crear una ruta para ENVIAR el Form al usuario - GET url '/auth/signup'
// 2.- Crear una ruta para obtener la informacion del usuario 
//     que ingreso en el form y GUARDARLA en BD - POST url '/auth/registrarUsuario'

// --- 1 ---
router.get("/auth/signup", (req, res) => {
    res.render("auth/signup")
})


// --- 2 --- 

// Check - Recibir los datos en req.body
// Check - Obtener la contrasena que esta en req.body.password
// Check - Hacer las cosas de Bcrypt
//   - Generar el salt
//   - Generar el hash a partir de el salt y req.body.password
// Check - Modificar req.body.password con el hash generado en el paso anterior
// Guardar todo el req.body en nuestro modelo User/ guardar en BD

router.post("/auth/signup", (req, res, next) => {
    const { password, email, username } = req.body

    //Verificar que los datos vengan completos
    if (!username || !email || !password) {
        res.render("auth/signup", { errorMessage: "Todos los campos deben estar rellenados." })
        return
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }


    const saltRounds = 12

    const salt = bcrypt.genSaltSync(saltRounds)
    const newPassword = bcrypt.hashSync(password, salt);

    //Poner todos los email en minuscula
    const emailLowerCase = email.toLowerCase()
    req.body.email = emailLowerCase
    req.body.passwordHash = newPassword
    delete req.body.password
    console.log(req.body)
    User.create(req.body)
        .then(() => {
            res.redirect("/userProfile")
        }).catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                res.status(500).render("auth/signup", { errorMessage: err.message })
            }
            else if (err.code === 11000) {
                res.status(500).render('auth/signup', {
                    errorMessage: 'Username and email need to be unique. Either username or email is already used.'
                });
            } else {
                next(err);
            }
        })
})

const sesionAbierta = (req, res, next) => {
    if (req.session.currentUser) {
        console.log("existe sesion")
        return res.redirect("/auth/movies")
    }
    next()
}

router.get("/auth/login", sesionAbierta, (req, res, next) => {
    res.render("auth/login")
})

router.post("/auth/login", (req, res) => {
    //Verificar si el email y la contrasena son validas
    // console.log(req.session)
    //User
    const { email, password } = req.body
    console.log(email, password)
    User.findOne({ email })
        .then(usuarioEncontrado => {
            console.log(usuarioEncontrado)
            req.session.currentUser = usuarioEncontrado

            if (!usuarioEncontrado) {
                res.render("auth/login", { errorMessage: "El email no esta registrado" })
                return
            } else if (bcrypt.compareSync(password, usuarioEncontrado.passwordHash)) {
                res.render('users/user-profile', { currentUser: usuarioEncontrado });
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }
            //res.redirect("/auth/login")
        })
        .catch(console.log)

})

router.post("/auth/logout", (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log("entre al error")
            next(err)
        }
        res.redirect('/');
    });
})

router.get("/auth/movies", isLoggedIn, (req, res) => {
    res.render("users/videosnetflix")
})

///Ejemplo de middleware

const funcion1 = (req, res, next) => {
    console.log("---- Funcion1")
    //console.log(req.body)
    next()
}

const funcion2 = (req, res, next) => {
    console.log("***** FUNCION 2")
    next()
}

router.get("/auth/ejemplo", funcion1, funcion2, (req, res, next) => {
    res.send("<h1>Hola mundo</h1>")
})


module.exports = router;