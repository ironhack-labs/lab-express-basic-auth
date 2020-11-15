const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const bcryptSalt = 10

const User = require('./../models/User.model')
const app = require('../app')

router.get('/sign-up', (req, res) => res.render('auth/sign-up'))

router.post('/sign-up', (req, res) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render('auth/sign-up', { errMsg: 'Fill every field' })
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hasPass = bcrypt.hashSync(password, salt)

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/sign-up', { errMsg: 'Username not available' })
                return
            }
            User.create({ username: username, password: hasPass })
        })
        .then(() => res.render('index', { successMsg: 'Sign up complete!' }))
        .catch(err => console.log('errooooor:', err))

})



router.get('/login', (req, res) => res.render('auth/login'))
router.post('/login', (req, res) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render('auth/login', { errMsg: 'Fill every field' })
        return
    }


    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errMsg: 'Username not exists' })
                return
            }
            if (!bcrypt.compareSync(password, user.password)) {
                res.render('auth/login', { errMsg: 'Incorrect Password' })
                return
            }
            req.session.currentUser = user
            res.render('index', { successMsg: 'Logged In!!' + user.username })

        })
        .catch(err => console.log('errooooor:', err))

})



module.exports = router