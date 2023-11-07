const router = require("express").Router();
const { isLoggedOut } = require('./../middleware/route-guard')
const bcrypt = require('bcryptjs')
const User = require('./../models/User.model')
const saltRounds = 10

router.get("/signup", isLoggedOut, (req, res, next) => {
    res.render("auth/signup")
});

router.post("/signup", isLoggedOut, (req, res, next) => {
    const { username, email, password } = req.body

    if (username.length === 0 || email.length === 0 || password.length === 0) {
        res.render('auth/signup', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ email })
        .then(findUser => {
            if (findUser) {
                res.render('auth/signup', { errorMessage: "Email ya registrado" })
                return
            }
            bcrypt
                .genSalt(saltRounds)
                .then(salt => bcrypt.hash(password, salt))
                .then(hashPass => {
                    User.create({ username, email, password: hashPass })
                })
                .then(() => res.redirect('/login'))
                .catch(error => console.log(error))
        })
})

router.get("/login", isLoggedOut, (req, res, next) => {
    res.render('auth/login')
})

router.post("/login", isLoggedOut, (req, res, next) => {
    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'No dejes ningún campo vacio' })
        return
    }
    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/signup', { errorMessage: 'Usuario no resgistrado' })
                return
            }
            if (bcrypt.compareSync(password, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Pass incorrecta' })
                return
            }
            req.session.currentUser = user
            res.redirect('/')
        })
        .catch(error => console.log(error))
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router;