const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10 // SALTING;
const mongoose = require('mongoose');


/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

//Signup GET
router.get('/signup', (req, res) => {
    res.render('signup');
})

//login GET
router.get('/login', (req, res) => {
    res.render('login');
})

//perfil GET
router.get('/perfil', (req, res) => {
    res.render('user-perfil', {
        users: req.session.currentUser
    });
})




//login POS

router.post('/login', (req, res) => {
    console.log('SESSION', req.session);
    const {
        username,
        password
    } = req.body


    User.findOne({
            username
        })
        .then((usuario) => {
            if (!usuario) {
                res.render('login', {
                    error: "el usuario no esta registrado"
                })
                return
            } else if (bcryptjs.compareSync(password, usuario.passwordHash)) {

                req.session.currentUser = usuario
                res.redirect('/perfil')
            } else {

                res.render('login', {
                    error: "pasword incorrecto"
                })
                return

            }

        }).catch(e => {
            next(e)
        })


})

//Signup POST
router.post('/signup', (req, res) => {
    const {
        username,
        password
    } = req.body

    bcryptjs.genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                passwordHash: hashedPassword
            })
        })
        .then(User => {
            req.session.currentUser = usuario
            res.redirect('/perfil')

        })
        .catch(e => {
            console.log(e);
            if (e instanceof mongoose.Error.ValidationError) {
                res.status(500).render('signup', {
                    error: e.message
                })


            } else if (e.code === 11000) {
                res.status(500).render('signup', {
                    error: "el usuario esta repetido"
                })

            }
        })


})

// RUTA PRIVADA
router.get('/private', (req, res) => {
    const user = req.session.currentUser
    if (!user) {
        res.redirect("/login");
    }
    res.render('private', {
        userInSession: req.session.currentUser
    });
});
router.get('/main', (req, res) => {
    const user = req.session.currentUser
    if (!user) {
        res.redirect("/login");
    }
    res.render('main', {
        userInSession: req.session.currentUser
    });
});

module.exports = router;