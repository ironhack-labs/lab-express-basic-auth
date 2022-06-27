const router = require('express').Router()
const User = require('./../models/User.model')

const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { isLoggedOut, isLoggedIn } = require("../middleware/session-guard");

router.get('/register', (req, res) => {
    res.render('auth/signup')
})

router.post('/register', (req, res) => {
    const { username, password: plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/signup', { errorMessage: 'You must fill all the fields to register.' })
        return
    }

    User
        .findOne({ username: username })
        .select({ username: 1 })
        .lean()
        .then(result => {
            if (result) {
                res.render('auth/signup', { errorMessage: 'Username already exists.' })
                return
            }
        })
        .catch(err => console.log(err))


    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPwd => User.create({ username, password: hashedPwd }))
        .then(() => res.redirect("/"))
        .catch(err => console.log(err))

})


router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.post('/login', isLoggedOut, (req, res) => {
    const { username, password: plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'You must fill all the fields to continue.' })
        return
    }

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'User not recognized' })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Invalid password' })
                return
            }

            req.session.currentUser = user
            res.redirect('/')
        })
        .catch(err => console.log(err))

})

router.post('/logout', isLoggedIn, (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})


module.exports = router;