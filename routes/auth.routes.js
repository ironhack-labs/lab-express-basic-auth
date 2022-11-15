const router = require('express').Router()
const bcrypt = require('bcryptjs')
const UserModel = require('../models/User.model')

const SALT_ROUNDS = 8

//-------------------------------GET-----------------------------//

router.get('/create', (req, res) => {
    res.render('auth/create')
})

router.get('/login', (req, res) => {
    res.render('auth/login')
})
//-------------------------------POST-----------------------------//

router.post('/create', (req, res, next) => {
    const { username, password } = req.body

    // const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    // const hash1 = bcrypt.hashSync(password, salt)

    bcrypt
        .genSalt(SALT_ROUNDS)
        .then((salt) => {
            return bcrypt.hash(password, salt)
        })
        .then((hash1) => {
            return UserModel.create({ username, password: hash1 })
        })
        .then((user) => {
            res.render('auth/user', user)
        })
        .catch((err) => next(err))
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body

    UserModel
        .findOne({ username })
        .then((user) => {
            if (!user) {
                res.render('auth/login', {
                    messageError: 'Incorrect username or password'
                })
                return
            }

            const verifyPass1 = bcrypt.compareSync(password, user.password)

            if (verifyPass1) {
                req.session.user = user
                res.redirect('/auth/user');
            } else {
                res.render('auth/login', {
                    messageError: 'Incorrect username or password'
                })
            }
        })
})

module.exports = router