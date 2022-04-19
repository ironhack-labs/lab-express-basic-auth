const router = require('express').Router()

const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { isUser } = require('./../middleware/route-guard')


const User = require('../models/User.model')

router.get('/signup', (req, res) => {
    res.render('authentication/signup')
})

router.post('/signup', (req, res, next) => {

    const { username, stringPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(stringPassword, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect('/login'))
        .catch(error => next(error));

})

router.get('/login', (req, res, next) => {
    res.render('authentication/login')
})

router.post('/login', (req, res, next) => {
    const { username, stringPassword } = req.body

    if (username.length === 0 || stringPassword.length === 0) {
        res.render('authentication/login', { errorMessage: 'Fill all the fields' })
        return
    }

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('authentication/login', { errorMessage: 'Unidentified User' })
                return
            }

            if (!bcryptjs.compareSync(stringPassword, user.password)) {
                res.render('authentication/login', { errorMessage: 'Ivalid Password' })
                return
            }

            req.session.currentUser = user
            res.redirect('/main')
        })
        .catch(error => next(error));

})

router.get('/main', isUser, (req, res) => {
    res.render('authentication/main')
})

router.get('/private', isUser, (req, res) => {
    res.render('authentication/private')
})




module.exports = router