const express = require('express');
const router = express.Router();

const User = require('./../models/User.model')

const bcryptjs = require('bcryptjs');
const saltRounds = 10

const { isLoggedOut, isLoggedIn } = require('../middleware/route-guard.js');


router.get("/registro", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/registro", (req, res, next) => {
    const { username, password } = req.body
    
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt)
        })
        .then(hashedPassword => {
        return User.create({username,password:hashedPassword})
        })
        .then(() => res.redirect('/'))
     .catch(err => console.log('Err', err))
})


router.get('/login', isLoggedOut, (req, res) => {
  res.render('auth/login')
})

router.post('/login', (req, res) => {
    const { username, password } = req.body
    
    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: "Usuario no reconocido" })
                return
            }
            if (bcryptjs.compareSync(password, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }
            req.session.currentUser = user
            res.redirect('/mi-perfil')
        })
    .catch(err => console.log(err))
})

router.get('/mi-perfil', (req, res, next) => {
    res.render('user/perfil')
})

router.get('/main', isLoggedIn, (req, res, next) => {
    res.render('user/main')
})

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('user/private')
})


    


module.exports = router





