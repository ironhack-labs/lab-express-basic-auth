const router = require("express").Router()
const bcryptjs = require('bcryptjs')
const res = require("express/lib/response")
const User = require('./../models/User.model')
const saltRounds = 10

//sign up render
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up')
})

//sign up handle
router.post('/sign-up', (req, res, next) => {
    const {username, password} = req.body
    if (username.length === 0 || password.length === 0) {
        res.render('auth/sign-up', { errorMessage: 'Some information is missing' })
        return
    }
    User
        .findOne({username})
        .then(user => {
            if(user) {
                res.render('auth/sign-up', { errorMessage: 'This username is already used' })
                return
            } else {
            bcryptjs
            .genSalt(saltRounds)
            .then(salt => bcryptjs.hash(password, salt))
            .then(hashedPwd => {
                return User.create({username, hashedPwd})
            })  
            .then(res.redirect('/'))
            .catch(err => next(err))
        }
    }) 

})

//log in render

router.get('/log-in', (req, res) => {
    res.render('auth/log-in')
})

//log in handle
router.post('/log-in', (req, res, next) => {
    const {username, password} = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/log-in', { errorMessage: 'Some information is missing' })
        return
    }
    User
    .findOne({username})
    .then(user => {
        if(!user) {
            res.render('auth/log-in', { errorMessage: 'Your username is not registered' })
            return
        } else if (bcryptjs.compareSync(password, user.hashedPwd) === false) {
            res.render('auth/log-in', { errorMessage: 'Your password is incorrect' })
            return
        } else {
            req.session.currentUser = user
            res.redirect('/profile')
        }
    })
})

//log out

router.post('/log-out', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router;

