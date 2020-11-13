const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const mongoose = require("mongoose")
const session = require('express-session')
const MongoStore = require("connect-mongo")(session)

const User = require('../models/User.model.js')


router.use(session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  }));


/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/sign-up', (req, res, next) => {
    res.render('signUp')
})

router.post('/sign-up', (req, res, next) => {

    const { username, password } = req.body

    User.findOne({ username: username })
        .then((result) => {
            if (!result) {
                bcrypt.genSalt(10)
                    .then((salt) => {
                        bcrypt.hash(password, salt)
                            .then((hashedPassword) => {
                                const hashedUser = { username: username, password: hashedPassword } //si name=value en form podriamos poner solo "email"

                                User.create(hashedUser)
                                    .then((result) => {
                                        res.redirect('/')
                                    })
                            })
                    })
                    .catch(() => {
                        res.send(err)
                    })

            } else {
                res.render('login', { errorMessage: 'Este usuario ya existe. ¿Intentabas hacer un Log In?' })
            }
        })
})

router.get('/log-in', (req, res, next) => {
    res.render('logIn')
})

router.post('/log-in', (req, res, next) => {
    // console.log(req.body)
    const { username, password } = req.body

    User.findOne({ username: username })
        .then((result) => {
            if (!result) {
                console.log(`El usuario no existe`)
                res.render('logIn', { errorMessage: 'Este usuario no existe' })
            } else {
                bcrypt.compare(password, result.password)
                    .then((resultFromBcrypt) => {
                        if(resultFromBcrypt){
                            req.session.currentUser = username
                            console.log(req.session)
                            res.redirect("/")
                        }else{
                            res.render('logIn', {errorMessage: 'Contraseña incorrecta. Por favor, vuelva a intentarlo'})
                        }
                    })
            }
        })
})

module.exports = router;
