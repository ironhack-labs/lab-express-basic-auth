const router = require('express').Router();
const User = require('../models/User.model')
const bcrypt = require('bcrypt');
// const { _router } = require('../app');

//we render the signup page
router.get('/signup', (req, res, next) => {

    res.render('signup')

});

router.get('/login', (req, res, next) => {

    res.render('login')

});

router.post('/login', (req, res, next) => {

    const { username, password } = req.body;

    User.findOne({ username: username })
        .then(userDB => {
            if (userDB === null) {

                res.render('login', { message: 'incorrect login details' })
            }
            if (bcrypt.compareSync(password, userDB.password)) {

                req.session.user = userDB
                res.redirect('profile')
            } else {
                res.render('login', { message: 'incorrect login details' })
            }

        })

});

//we ue post to get the informaton from teh signup page

router.post('/signup', (req, res, next) => {

    console.log(req.body)
    const { username, password } = req.body
    //add simple validation
    if (password.length < 4) {

        res.render('signup', { message: 'Your password needs to be at least 4 characters long' });
        return;
    }
    if (username.length === 0) {
        res.render('signup', { message: 'Your username cannot be empty' });
        return;
    }
    //moving on
    //check if user exists
    User.findOne({ username: username })
        .then(user => {

            if (user !== null) {
                res.render('signup', { message: 'User name already taken' });
            } else {

                const salt = bcrypt.genSaltSync()
                const hash = bcrypt.hashSync(password, salt)
                console.log(hash)

                User.create({ username: username, password: hash })
                    .then(user => {
                        console.log(user)
                        res.redirect('/')
                    })
                    .catch(err => {
                        next(err)
                    })
            }
        })
})

router.get('/logout', (req, res, next) => {

    req.session.destroy(err => {

        if (err) {
            next(err)
        } else {
            res.redirect('/')
        }
    })
})


module.exports = router