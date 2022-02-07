const router = require("express").Router();

const bcryptjs = require('bcryptjs')

const User = require('./../models/User.model')
const saltRounds = 10

//SIGN UP ROUTE
router.get("/registro", (req, res, next) => {
    res.render("auth/signup-form");
});

router.post("/registro", (req, res, next) => {
    // res.render("auth/signup-form");
    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup-form", { errorMessage: "Rellena los campos" })
        return
    }
    User.findOne({ username })
        .then(user => {
            if (user === username)
                res.render("auth/signup-form", { errorMessage: "Ya existe un usuario registrado con ese nombre" })
            return
        })

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            console.log('El hash es', hashedPassword)
            return User.create({ username, password: hashedPassword })
        })
        .then(() => res.redirect('/'))
        .catch(error => next(error))

});

// LOG IN ROUTE
router.get("/ingresar", (req, res, next) => {
    res.render("auth/login-form");
});

router.post("/ingresar", (req, res, next) => {
    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/login-form", { errorMessage: "Rellena los campos" })
        return
    }
    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render("auth/login-form", { errorMessage: "Usuario no registrado" })
                return
            } else if (bcryptjs.compareSync(password, user.password) === false) {
                res.render('auth/login-form', { errorMessage: 'La contraseña es incorrecta' })
                return
            } else {
                req.session.currentUser = user
                console.log('El objeto de EXPRESS-SESSION', req.session)
                res.redirect("/perfil")
            }
        })
})


module.exports = router