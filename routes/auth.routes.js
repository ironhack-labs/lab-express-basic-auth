const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register', (req, res) => {
    const { email, plainPwd } = req.body

    if (!email.length || !plainPwd.length) {
        res.render('auth/login', { errorMsg: 'Complete all the fields' })
        return
    }

    User
        .findOne({ email })
        .then(emailFound => {
            if (emailFound) {
                res.render('auth/register', { errorMsg: 'email already register' })
                return
            }
        })
        .catch(err => console.log(err))
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPwd, salt))
        .then(hashPwd => User.create({ email, password: hashPwd }))
        .then(() => res.redirect('/login'))
        .catch(err => console.log(err))
})


router.get("/login", (req, res) => {
    res.render("auth/login")
})

router.post('/login', (req, res) => {
    const { email, plainPwd } = req.body

    if (!email.length || !plainPwd.length) {
        res.render('auth/login', { errorMsg: 'Complete all the fields' })
        return
    }

    User
        .findOne({ email })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMsg: 'email not registered' })
                return
            }

            if (!bcrypt.compareSync(plainPwd, user.password)) {
                res.render('auth/login', { errorMsg: 'incorrect password' })
                return
            }

            req.session.currentUser = user
            console.log('SESIÓN INICIADA ->', req.session)
            res.redirect('/')

        })
        .catch(err => console.log(err))

})

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))

})



module.exports = router