const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')

/* GET auth page */
router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const {
        email,
        password
    } = req.body
    console.log(email)
    //console.log(password)


    //Validación de usuario

    if (!email || !password) {
        res.render('auth/signup', {
            errorMessage: 'Las informaciones username, email y contraseña son mandatorias'
        });

        return;
    }

    // Validación de password

    // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    // if (!regex.test(password)) {

    //     res.status(500).render('auth/signup', {
    //         errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'
    //     });

    //     return;

    // }



    bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
            email: email,
            passwordHash: hash
        }))
        .then(data => {
            console.log('YA ESTAS HACIENDO SIGN UP')
            res.redirect('/')
        })


    console.log('ESTA ES LA INFO DEL REQ BODY MUCHACHÓN: ', req.body);

});

//Ruta login
router.get('/login', (req, res) => res.render('auth/login'));

// Ruta POST login

router.post('/login', (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }

    User.findOne({
            email
        })
        .then(user => {
            if (!user) {
                res.render('auth/login', {
                    errorMessage: 'Email is not registered. Try with other email.'
                });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                res.render('users/user-profile', {
                    user
                });
            } else {
                res.render('auth/login', {
                    errorMessage: 'Incorrect password.'
                });
            }
        })
        .catch(error => next(error));
});




module.exports = router;