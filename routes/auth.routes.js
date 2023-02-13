const router = require("express").Router()
const bcrypt = require('bcryptjs')
const { isLoggedIn, isLoggedOut } = require("../middlewares/route-guard")

const User = require('./../models/User.model')
const saltRounds = 10


router.get('/register', isLoggedOut, (req, res) => {
    res.render('auth/register')
})


router.post('/register', isLoggedOut, (req, res) => {
    const { username, email, userPwd } = req.body

    if (email.length === 0 || userPwd.length === 0 || username.length === 0) {
        res.render('auth/register', { errorMessage: 'Fill every field' })
        return
    }
    const promises = [User.findOne({ username }), User.findOne({ email })]

    Promise
        .all(promises)
        .then(([username1, email1]) => {
            if (username1) res.render('auth/register', { errorMessage: 'Existing username' })
            else if (email1) res.render('auth/register', { errorMessage: 'Existing email' })
            else {
                return bcrypt.genSalt(saltRounds)
            }
        })
        .then(salt => bcrypt.hash(userPwd, salt))
        .then(password => {
            User.create({ username, email, password })
        })
        .then(user => {
            res.redirect('/login')
        })
        .catch(err => console.log(err))


})


router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.post('/login', isLoggedOut, (req, res) => {
    const { email, userPwd } = req.body

    if (email.length === 0 || userPwd.length === 0) {
        res.render('auth/login', { errorMessage: 'Fill both fields' })
        return
    }
    User
        .findOne({ email })
        .then(user => {
            if (!user) res.render('auth/login', { errorMessage: 'User not found' })
            else if (!bcrypt.compareSync(userPwd, user.password)) res.render('auth/login', { errorMessage: 'Invalid user' })
            else {
                req.session.currentUser = user
                res.redirect('/profile')
            }
        })
        .catch(err => console.log(err))
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router