const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const bcryptSalt = 10

const User = require('./../models/User.model');
const { replaceOne } = require('./../models/User.model');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


router.get("/signup", (req, res) => res.render('signup-page'))

router.post("/signup", (req, res) =>{
    const {username, pwd} = req.body
    if (username.length === 0 || pwd.length === 0) {
        res.render('signup-page', { errorMessage: 'Por favor rellene usted los campos, zoquete' })
        return
    }
    if (pwd.length < 4) {
        res.render('signup-page', { errorMessage: 'Contraseña demasiado corta' })
        return
    }
    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render('signup-page', { errorMessage: 'El usuario ya existe' })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(pwd, salt)
            User
                .create({ username, password: hashPass })
                .then(() => res.redirect('/'))
            .catch(err => console.log('errorrrr', err))
        })
    .catch(err => console.log('errorrrr', err))
})
    // login

router.get("/login", (req, res) => res.render('login-page'))
router.post("/login", (req, res) => {
    const { username, pwd } = req.body
    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('login-page', { errorMessage: 'El usuario no existe' })
                return
            }
            if (bcrypt.compareSync(pwd, user.password) === false) {
                res.render('login-page', { errorMessage: 'Contraseña incorrecta' })
                return
            }
            req.session.currentUser = user
            console.log(req.session)
            res.redirect('/')
        })
        .catch(err => console.log('errorrrrrrrrrrr', err))
    
})
    
router.use((req, res, next) => req.session.currentUser ? next() : res.redirect('/login'))

router.get('/private', (req, res) => {
    res.render('private',req.session.currentUser)

})

router.get('/main', (req, res) => {
    res.render('main', req.session.currentUser)

})

           
    





module.exports = router;
