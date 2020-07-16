const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

/* GET Users */
router.get('/users', (req, res, next) => {
    res.redirect('users/signup')
})

/* GET Sign Up */
router.get('/users/signup', (req, res, next) => {
    res.render('users/signup-form')
})

/* POST Sign Up */
router.post('/users/signup', (req, res, next) => {
    const body = req.body

    //Encrypt password
    const user = new User({
        user: body.user,
        password: body.password
    })
    user.save()
        .then(() => res.redirect('/users/login'))
});

/* GET login */
router.get('/users/login', (req, res, next) => {
    res.render('users/login')
})

/* POST login */
router.post('/users/login', (req, res, next) => {
    const body = req.body
    User.findOne({ user: body.user })
        .then(user => {
            if (user) {
                user.checkPass(body.password)
                    .then(match => {
                        if (match) { 
                            req.session.userId = user._id
                            res.redirect('/session')
                        } else {
                            res.send('Invalid Pass')
                        }
                    })
            } else {
                res.send('User not found')
            }
        })
        .catch(error => console.error(error))
    // res.json(body)
})

module.exports = router;