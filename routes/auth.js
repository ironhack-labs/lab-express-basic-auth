const router = require("express").Router();
const bcrypt = require("bcryptjs")
const User = require('../models/User')

router.get('/signup', (req, res, next) => {
    res.render('signup')
})
router.post('/signup', (req, res, next) => {
    const credentials = req.body
    const { username, password } = credentials
    if (password.length < 6) {
        res.render('signup', { message: 'Password must be at least 6 characters long..' })
        return
    }
    if (username.length === 0) {
        res.render('signup', { message: 'Please enter a valid username..' })
        return
    }

    User.findOne({ username })
        .then(userFromDb => {
            if (userFromDb !== null) {
                res.render('signup', { message: 'Username is already taken..' })
            }
            else {
                const salt = bcrypt.genSaltSync()
                const hash = bcrypt.hashSync(password, salt)
                User.create({ username, password: hash })
                    .then(createdUser => {
                        console.log(createdUser)
                        res.redirect('/login')
                    })
                    .catch(err => next(err))
            }
        })
})

router.get('/login', (req, res, next) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    User.findOne({ username })
        .then(userFromDb => {

            // check if we have this username in the DB
            if (userFromDb === null) {
                res.render('login', {
                    message: 'Invalid credentials'
                })
                return
            }

            // here username is correct
            // check the password against the hash in the DB
            if (bcrypt.compareSync(password, userFromDb.password)) {
                console.log('authenticated')
                // here credentials match the ones in DB
                req.session.user = userFromDb
                console.log(req.session)

                // redirect to profile page
                res.redirect('/profile')
            } else {
                res.render('login', {
                    message: 'Incorrect credentials, please try again!'
                })
            }
        })
})

module.exports = router;