const express = require('express');
const router = express.Router();
const User = require('./../models/User.model')

//Encriptación
const bcrypt = require("bcrypt")
const bcryptSalt = 10



/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


//GET register page
router.get('/registro', (req, res) => {
    res.render('auth/signup')
})
//GET login page
router.get('/iniciar-sesion', (req, res) => {
    res.render('auth/login')
})
router.get('/productos', (req, res) => { 
    res.render ('main')
})


//REGISTER CONTROLLER
router.post('/registro', (req, res) => {
    const { username, password } = req.body

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)
    
    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMsg: 'Rellena los campos para registrarte' })
        return
    }
    if (password.length < 6) {
        res.render('auth/signup', { errorMsg: 'La contraseña es corta, mínimo 5 letras. Máximo, descúbrelo...' })
        return
    }

    User
        .create({ username, password: hashPass })
        .then(newUser => {
            console.log("Se ha creado el usuario", newUser)
            res.redirect("/")
        })
        .catch(err => console.log("Error", err))
})

//LOGIN CONTROLLER
router.post('/iniciar-sesion', (req, res) => {
    const { username, password } = req.body
    //aqui iria la validacion
    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMsg: 'Campos vacios' })
        return
    }
    User
        .findOne({username})

        .then(userRegistered => {
            console.log (username)

            if (!userRegistered) {
                res.render('auth/login', { errorMsg: 'Usuario no reconocido' })
                return
            }

            if (bcrypt.compareSync(password, userRegistered.password)) {
                

                
                
                req.session.currentUser = userRegistered
                console.log('El usuario con sesión inciada es:', req.session.currentUser)
                res.redirect('/')

            } else {

                res.render('auth/login', { errorMsg: 'Contraseña incorrecta' })
                return
            }
        })
})


// Logout
router.get('/cerrar-sesion', (req, res) => {
console.log("USER", req.session.currentUser)
    req.session.destroy(() => res.redirect("/iniciar-sesion"))
    console.log("SESIÓN CERRADA")
})


//GET profile page and check

router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render("auth/login", { errorMsg: 'No puedes ver el gif.' })
    }
})


router.get("/perfil", (req, res) => {
    res.render('profile', req.session.currentUser)
});


module.exports = router;
