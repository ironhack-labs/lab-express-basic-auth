const {
    Router
} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10
const mongoose = require('mongoose')

const router = new Router

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.get('/userProfile', (req, res, next) => {
    res.render('usrs/userProfile', {userInSession: req.session.currentUser});
});

router.get('/main', (req, res, next) => {
    res.render('main', {
        userInSession: req.session.currentUser || false
    })
})

router.get('/private', (req, res, next) => {
    res.render('private', {
        userInSession: req.session.currentUser || false
    })
})

router.get('/login', (req, res, next) => {
    res.render('auth/login')
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/')
})

router.post('/signup', (req, res, next) => {
    const {
        username,
        email,
        password
    } = req.body;
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,10}/;
    if (!username || !email || !password) {
        res.render('auth/signup', {
            errorMessage: 'El usuario, email y password son obligatorios'
        });
        return;
    }
    if (!regex.test(password)) {
        res.status(500).render('auth/signup', {
            errorMessage: 'The password needs to be between 6 and 10 characters and must contain at least one number, one lowercase and one uppercase letter'
        })
        return;
    }
    bcrypt.genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            console.log(`hash es ${hashedPassword}`);
            return User.create({
                username: username,
                email: email,
                passwordHash: hashedPassword
            });
        })
        .then(usuario => {
            console.log(`Salio todo bien, se creo a: ${usuario}`);
            res.redirect('usrs/userProfile');
        })
        .catch(err => {
            if (err instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', {
                    errorMessage: err.message
                });
            } else if (err.code === 11000) {
                res.status(500).render('auth/signup', {
                    errorMessage: 'El usuario o correo ya existen'
                });
            } else {
                next(err);
            }
        });
});


router.post('/login', (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, email and password to login'
        })
        return;
    }
    User.findOne({
            email
        })
        .then(user => {
            if (!user) {
                res.render('auth/login', {
                    errorMessage: 'This user does not exist'
                });
                return;
            } else if (bcrypt.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('/userProfile')
            } else {
                res.render('auth/login', {
                    errorMessage: 'Incorrect Password.'
                });
            }
        })
        .catch(err => next(err))

})

module.exports = router;