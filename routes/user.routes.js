const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { isLoggedOut } = require('../middlewares/route-guard');
const { isLoggedIn } = require('../middlewares/route-guard');


const saltRounds = 10


router.get("/signup", (req, res, next) => {
    res.render("user/signup");
});


router.post("/signup", (req, res, next) => {

     const { username, basePassword } = req.body


    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(basePassword, salt))
        .then(hash => User.create({ username, password: hash }))
        .then(() => res.redirect('/user/login'))
        .catch(err => next(err))

})


// Login form (render)
router.get('/login', (req, res) => {
    res.render('user/login')
})

// Login form (post)

router.post('/login', (req, res, next) => {

    const { username, password } = req.body
    
    if (username.length === 0 || password.length === 0) {
        res.render('user/login', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('user/login', { errorMessage: 'Usuari@ no reconocido' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('user/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }

            req.session.currentUser = foundUser // login!
           
            
            res.redirect('/')
        })
        .catch(err => next(err))
})

router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("main");
})

router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("private");
})

router.get('/close-session', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})






module.exports = router