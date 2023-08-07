const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const { isLoggedin } = require('../middlewares/route-guard');

const saltRounds = 10




//signUp form get
router.get('/signup', (req, res) => {

    res.render('auth/signup')



})





//signUp form post

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ username, password: hash }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))

})



//login form get(render)

router.get('/login', (req, res) => {
    res.render('auth/login')


})




// login form post

router.post('/login', (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'rellenalo todo pendejo' })
        return
    }

    User
        .findOne({ username })
        .then(user => {


            if (!user) {
                res.render('auth/login', { errorMessage: 'usuario desaparecido' })
                return
            }
            if (!bcrypt.compareSync(password, user.password)) {
                res.render('auth/login', { errorMessage: 'meehhh intentalo de nuevo' })
                return
            }


            req.session.currentUser = user // login!
            res.redirect('/')

        })

        .catch(err => console.log(err))

})



//redirect get index

module.exports = router


