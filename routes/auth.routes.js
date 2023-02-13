const router = require("express").Router();
const bcrypt = require('bcryptjs')

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard');
const { isLoggedIn } = require('../middlewares/route-guard')
const { Session } = require("express-session");
const saltRounds = 10


//Create Account
router.get('/singup', (req, res, next) => {
    res.render('auth/signup-form')
})

router.post('/singup', (req, res, next) => {

    const { username, userPassword, email } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPassword, salt))
        .then(passwordHash => User.create({ username, password: passwordHash, email }))
        .then(() => res.redirect('/user'))
        .catch(err => res.render('auth/signup-form', { errorMessage: 'Already used' }))
})


// LogIn
router.get('/log-in', (req, res, next) => {
    res.render('auth/login-form')
})

router.post('/log-in', (req, res, next) => {
    const { email, userPassword } = req.body

    if (email.length === 0 || userPassword.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Fill All' })
        return
    }

    User
        .findOne({ email })
        .then(user => {

            if (!user) {
                res.render('auth/login-form', { errorMessage: 'Not a User' })
            }
            else if (!bcrypt.compareSync(userPassword, user.password)) {
                res.render('auth/login-form', { errorMessage: 'Password Error' })
            }
            else {
                req.session.currentUser = user
                res.redirect('/user')
            }
        })
})

// Close Session
router.get('/close-session', (req, res) => {

    if (req.session.currentUser) {
        req.session.destroy(() => res.redirect('/'))
    }

})



module.exports = router;