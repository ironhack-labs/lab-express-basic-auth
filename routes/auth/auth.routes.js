const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const saltRounds= 10

const User = require('../../models/User.model')
const { isLoggedIn } = require('../../middlewares/route-guard')

const { isLoggedOut } = require('../../middlewares/route-guard')

//isloggedout

// sign up
router.get("/registro", (req, res, next) => {
    res.render("auth/signup")
})
router.post("/registro", (req, res, next) => {
    const { username, email, pass } = req.body //pasas la info que quieres que se registre

    bcrypt //para crear la contraseña
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(pass, salt))
    .then(hashedPassword => User.create({ username, email, password: hashedPassword}))
    .then(() => res.redirect('/inicio-sesion'))
    .catch(err => next(err))
})

// login
router.get("/inicio-sesion", isLoggedOut,  (req, res, next) => {
    res.render('auth/login')
})

router.post('/inicio-sesion', (req, res, next) => {
    const { email, password } = req.body
    if (email.length === 0 || password.length === 0) { //chequea que la longitud de los strings sea la correcta
        res.render('auth/login', { errorMessage: 'Los campos son obligatorios'}) // salta el error si es 0
        return
    }
    
    User
    .findOne({ email }) // encuentra el user por el email
    .then(foundUser => {
        if(!foundUser) { // si no se encuentra el usuario
            res.render('auth/login', { errorMessage: 'Usuario no encontrado'})
            return
        }
        if (!bcrypt.compareSync(password, foundUser.password)) { // si no se encuentra la contraseña
            res.render('auth/login', { errorMessage: 'Contraseña incorrecta'})
            return
        }
        req.session.currentUser = foundUser // si el usuario de la sesion(?) es el usuario que se busca
        res.redirect('/perfil') // que se redirija
    })
})

// desconectar
router.get('/desconectar', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router;