// username:
// email:
// passwordHash:
// birthday: String,
//     birthday: Date,
//         profession: String,
//             experience: String,
//                 pet: String

const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')

const saltRounds = 10

router.get('/signup', (req, res) => {

    res.render('auth/signup')

})



router.post('/signup', (req, res, next) => {

    const { username, email, plainPassword, birthday, profession, experience, pet } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(passwordHash => User.create({ username, email, password: passwordHash, birthday, profession, experience, pet }))
        .then(() => res.redirect('/login'))
        .catch(err => next(err))

})

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post("/login", (req, res, next) => {

    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: ' sorry,is not correct' })
        return
    }
    console.log('---------------------------------------------------------')

    User
        .findOne({ email })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: ' sorry,is not correct' })
                return
            }

            if (bcrypt.compareSync(password, foundUser.password) === false) {
                res.render('auth/login', { errorMessage: ' sorry,is not correct' })
                return
            }

            req.session.currentUser = foundUser
            console.log('strt session', req.session)
            res.redirect('/profile')
        })
        .catch(err => next(err))


})

router.get('/sesionout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})



module.exports = router
