const router = require("express").Router()
const bcryptjs = require('bcryptjs')
const User = require('./../models/User.model')
const saltRounds = 10









router.get('/signup', (req, res, next) => res.render("../views/auth/signup-form.hbs"))



router.post('/signup', (req, res, next) => {
    const { username, userPwd } = req.body
    if (!username.length || !userPwd.length) {
        res.render('auth/signup-form', { errorMessage: 'Please, do not let any fields empty' })
        return
    }

    User.findOne({ username }).then(user => {
        if (user) {
            res.render('auth/signup-form', { errorMessage: 'Username alreday in database. Please log in' })
            return
        }
    })




    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(userPwd, salt))
        .then(hashedPassword => {
            console.log('El hash a crear en la BBDD es', hashedPassword)
            return User.create({ username, password: hashedPassword })
        })
        .then(() => res.redirect('/'))
        .catch(error => next(error))
})

router.get('/login', (req, res, next) => res.render('../views/auth/login-form'))


router.post('/login', (req, res, next) => {
    const { username, userPwd } = req.body


    if (!username.length || !userPwd.length) {
        res.render('auth/login-form', { errorMessage: 'Please, do not let any fields empty' })

        return
    }

    User.findOne({ username }).then(user => {

        if (user) {
            console.log("this is " + user.password)
        }
        if (!user) {
            res.render('auth/login-form', { errorMessage: 'Username not found in database' })
            return
        }
        if (bcryptjs.compareSync(userPwd, user.password) === false) {
            res.render('auth/login-form', { errorMessage: 'Wrong password' })
            return
        }

        if (req.session.currentUser = user) {
            res.redirect('/profile')
        }




    })


})


router.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'))
})

module.exports = router;