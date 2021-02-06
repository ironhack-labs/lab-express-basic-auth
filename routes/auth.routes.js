const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('./../models/user.model')


router.get('/signup', (req, res) => res.render('auth/signup-form'))
router.post('/signup', (req, res) => {

    const { username, password } = req.body

    User
        .findOne({ username })
        .then(user => {

            if (username.length === 0 || password.length === 0) {
                res.render('auth/signup-form', { errorMsg: 'Fill in the fields!' })
                return
            }

            if (user) {
                res.render('auth/signup-form', { errorMsg: 'User already exists!' })
                return
            }

            if (password.length <= 1) {
                res.render('auth/signup-form', { errorMsg: 'Weak password!' })
                return
            }

            const bcryptSalt = 10
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.render('./auth/main'))
                .catch(err => console.log(err))


        })
        .catch(err => console.log(err))

})
router.get('/login', (req, res) => res.render('auth/login-form'))
router.post('/login', (req, res) => {

    const { username, password } = req.body


    if (username.length === 0 || password.length === 0) {
        res.render('auth/login-form', { errorMsg: 'Fill in the fields!' })
        return
    }


    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login-form', { errorMsg: 'Unknown user!' })
                return
            }

            if (!bcrypt.compareSync(password, user.password)) {
                res.render('auth/login-form', { errorMsg: 'Wrong password!' })
                return
            }

            req.session.currentUser = user
            res.render('./auth/private')
        })
        .catch(err => console.log(err))
})




router.get("/logout", (req, res) => {
    req.session.destroy((err) => res.redirect("/auth/private"))
})


module.exports = router;