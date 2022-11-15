const bcrypt = require("bcryptjs")
const router = require("express").Router()
const User = require("../models/User.model")
const { isLoggedOut, isLoggedIn } = require('../middleware/route-guard');
const saltRounds = 10

router.get("/sign-up", isLoggedOut, (req, res) => res.render("auth/sign-up"))

router.post("/sign-up", isLoggedOut, (req, res) => {

    const { username, password } = req.body

    User.
        findOne({ username })
        .then(foundUser => {
            if (foundUser) {
                res.render("auth/sign-up", { errorMessage: "Usuario ya registrado" })
            }
            return
        })

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect("/login"))
        .catch(err => console.log(err))

})

router.get("/login", isLoggedOut, (req, res) => res.render("auth/login"))

router.post("/login", isLoggedOut, (req, res) => {

    const { username, password } = req.body

    if (username === "" || password === "") res.render("auth/login", { errorMessage: "Rellene lo campos, por favor" })

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render("auth/login", { errorMessage: "Usuario incorrecto" })
                return
            }
            if (!bcrypt.compareSync(password, user.password)) {
                res.render("auth/login", { errorMessage: "Contraseña incorrecta" })
            }
            req.session.currentUser = user

            res.render("user/main", { user, session: req.sessionID })
        })
        .catch(err => console.log(err))
})

router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("user/main", { user: req.session.currentUser })
})

router.get("/private", isLoggedIn, (req, res) => res.render("user/private", { session: req.sessionID }))

router.get('/log-out', (req, res) => {
    req.session.destroy(() => res.redirect('/login'))
})



module.exports = router;