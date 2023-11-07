const router = require("express").Router();

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10
const { isLoggedOut } = require('../middleware/route-guard')
router.get("/", isLoggedOut, (req, res) => {
    res.render("sesion/sign-up")
})
router.post("/", isLoggedOut, (req, res, next) => {
    const { email, password } = req.body
    if (email.length === 0 || password.length === 0) {
        res.render('sesion/log-in', { errorMessage: 'No me tomes por tonto , rellena' })
        return
    }
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(passwordHash => User.create({ email, password: passwordHash }))
        .then(() => res.redirect('/log-in'))
        .catch(err => next(err))
})
module.exports = router;