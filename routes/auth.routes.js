const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRound = 10
const { isLoggedOut } = require('../middleware/routh-guard')
const { isLoggedIn } = require('../middleware/routh-guard')


router.get("/", (req, res) => {
    res.render('index')
})

router.get("/signup", (req, res) => {
    res.render('auth/signup')
})
router.post("/signup", isLoggedOut, (req, res, next) => {
    const { username, password } = req.body


    bcrypt
        .genSalt(saltRound)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(passwordHash => User.create({ username, password: passwordHash }))
        .then(() => res.redirect('/sessionstart'))
        .catch(err => next(err))



})



router.get("/sessionstart", isLoggedOut, (req, res) => {


    res.render("auth/sessionstart")
})


router.post("/sessionstart", isLoggedOut, (req, res, next) => {

    const { username, password } = req.body


    if (username.length === 0 || password.length === 0) {
        res.render('auth/startsession', { errorMessage: 'Fill in all the gaps' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/sessionstart', { errorMessage: 'user not registered' })
                return
            }

            if (bcrypt.compareSync(password, foundUser.password) === false) {
                res.render('auth/sessionstart', { errorMessage: 'wrong email' })
                return
            }

            req.session.currentUser = foundUser

            res.redirect('/')
        })
        .catch(err => next(err))
})




router.get('/close-session', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})



router.get('/public', (req, res) => {
    res.render('imagen/publica')
})

router.get('/private', isLoggedIn, (req, res) => {
    res.render('imagen/privado')
})






//     router.get('/logout', (req, res) => {
//         req.session.destroy(() => res.redirect('/'))
//     })


//     module.exports = router


// }


















module.exports = router
