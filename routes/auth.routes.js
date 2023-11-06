const router = require("express").Router()
const bcrypt = require('bcryptjs')

const User = require('./../models/User.model')
const saltRounds = 10

router.get('/login', (req, res) => {
    res.render('auth/login-page')
})

router.post('/login', (req, res, next) => {
    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login-page', { errMessage: "All fields must be completed" })
        return
    }

    User
        .findOne({ email: email })
        .then(usr => {
            if (!usr) {
                res.render('auth/login-page', { errMessage: "Email does not exist" })
                return
            }

            if (bcrypt.compareSync(password, usr.password) === false) {
                res.render('auth/login-page', { errMessage: "Password is incorrect" })
                return
            }


            req.session.curentUser = usr

            console.log("----> CURRENT USER \n", req.session.curentUser)
            res.redirect('/main')
        })
})

router.get('/signup', (req, res) => {
    res.render('auth/signup-page')
})
router.post('/signup', (req, res, next) => {
    const { email, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(pswHash => User.create({ email, password: pswHash }))
        .then(() => res.redirect('/login'))
        .catch(err => console.log("ERR: ", err))

})

module.exports = router;
