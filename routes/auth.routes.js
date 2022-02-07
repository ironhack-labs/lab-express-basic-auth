const router = require('express').Router()
const bcryptjs = require('bcryptjs')

const User = require('./../models/User.model')
const rounds = 10

router.get("/signup", (req, res, next) => res.render("auth/signup-form"))

router.post('/signup', (req, res, next) => {
    const { email, username, password } = req.body

    bcryptjs
            .genSalt(rounds)
            .then(salt => bcryptjs.hash(password, salt))
            .then(hashedPassword => {
                console.log('The Hash created in de DB is ', hashedPassword)
                return User.create({ email, username, passwordHash: hashedPassword })
            })
            .then(() => res.redirect('/'))
            .catch(err => next(err))
})

router.get('/login', (req, res, next) => res.render('auth/login-form'))

router.post('/login', (req, res) => {
    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login-form', {errorMessage: 'Please fill in all the fields'})
        return
    }

    User
        .findOne({email})
        .then(user => {
            if (!user) {
                res.render('auth/login-form', {errorMessage: 'Email not registered in the Database'})
            } else if (!bcryptjs.compareSync(password, user.passwordHash)){
                res.render('auth/login-form', {errorMessage: 'Password is incorrect'})
                return
            } else {
                req.session.currentUser = user
                res.redirect('/profile')
            }
        })
})

router.post('/signoff', (req, res) => req.session.destroy(() => res.redirect('/login')))

module.exports = router