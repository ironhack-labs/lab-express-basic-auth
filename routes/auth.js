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
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashPass => {
            User.create({ username, email, password: hashPass })
        })
        .then(() => res.redirect('/login'))
        .catch(error => console.log(error))
})

router.get("/login", isLoggedOut, (req, res, next) => {
    res.render('auth/login')
})

router.post("/login", isLoggedOut, (req, res, next) => {
    const { email, password } = req.body
    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/signup', { errorMessage: 'Usuario no resgistrado' })
                return
            }
            if (!bcrypt.compareSync(password, user.password)) {
                res.render('auth/signup', { errorMessage: 'Pass incorrecta' })
            }
            req.session.currentUser = user
            console.log('SESIÓN INICIADA ->', req.session)
            res.redirect('/')
        })
        .catch(error => console.log(error))
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router;