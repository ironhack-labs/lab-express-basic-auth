const express = require('express');
const router = express.Router();

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const User = require('./../models/user.model')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));



// Registro

router.get('/register', (req, res)=> res.render('auth/register'))
router.post('/register', (req, res)=>{
    const {username ,password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/register', { errorMsg: 'Complete Fields' })
        return
    }
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    User
        .create({ username, password: hashPass })
        .then(theUserCreated => {
            console.log('New user complete', theUserCreated)
            res.redirect('/')
        })
        .catch(err => console.log("Error", err))
})


// Loguearse


router.get('/   ', (req, res) => res.render('auth/login'))
router.post('/iniciar-sesion', (req, res) => {

    const { username, password } = req.body


    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMsg: 'User or Pass incorrect' })
        return
    }

    User.findOne({ username: username })
        .then(theUser => {

            if (!theUser) {
                res.render('auth/login', { errorMsg: 'User incorrect' })
                return
            }

            if (bcrypt.compareSync(password, theUser.password)) {

                req.session.currentUser = theUser
                console.log('Sesion start', req.session.currentUser)
                res.redirect('/private')

            } else {

                res.render('auth/login', { errorMsg: 'Pass incorrect' })
                return
            }
        })
})

// Login

router.get('/iniciar-sesion', (req, res) => res.render('auth/login'))
router.post('/iniciar-sesion', (req, res) => {

    const { username, password } = req.body


    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMsg: 'User or Password incorrect' })
        return
    }

    User.findOne({ username: username })
        .then(theUser => {

            if (!theUser) {
                res.render('auth/login', { errorMsg: 'New User' })
                return
            }

            if (bcrypt.compareSync(password, theUser.password)) {

                req.session.currentUser = theUser
                console.log('Sesion Start:', req.session.currentUser)
                res.redirect('/private')

            } else {

                res.render('auth/login', { errorMsg: 'Incorrect password' })
                return
            }
        })
})



/* Area privada */
router.get('/private', (req, res) => res.render('private'))

// Logout
router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect("/iniciar-sesion"))
})


module.exports = router;
