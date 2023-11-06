const router = require("express").Router();

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10
const { isLoggedOut } = require('../middleware/route-guard')

router.get("/", isLoggedOut, (req, res) => {
    res.render("sesion/log-in")
})
router.post("/", (req, res, next) => {
    const { email, password } = req.body
    if (email.length === 0 || password.length === 0) {
        res.render('sesion/log-in', { errorMessage: 'No me tomes por tonto , rellena' })
        return
    }
    User
        .findOne({ email })
        .then(foundUser => {
            if (!foundUser) {
                res.render("sesion/log-in", { errorMessage: 'No te has registrado' })
                return
            }
            if (bcrypt.compareSync(password, foundUser.password) === false) {
                res.render('sesion/log-in', { errorMessage: 'no has metio bien la contraseña monstro' })
                return
            }
            req.session.currentUser = foundUser
            console.log('has inidiado sesion==>', req.session)
            res.redirect('/')
        })
        .catch(err => next(err))
})
router.get('/log-out', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})



module.exports = router;