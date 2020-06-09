const {Router} = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;

const router = new Router();

router
    .get('/signup', (req, res) => res.render('auth/signup'))
    .post('/signup', (req, res) => {
        const {username, email, password} = req.body;
        bcryptjs
            .genSalt(saltRounds)
            .then(salt => bcryptjs.hash(password, salt))
            .then(hashedPassword => {
                return User.create({username, email, passwordHash: hashedPassword})
            })
            .then(newUser => {
                console.log(`New user created: ${newUser}`)
                res.redirect('/user-profile')
            })
            .catch(err => console.log(`Error occured while creating a user: ${err}`))
    })
    .get('/user-profile', (req, res) => res.render('users/user-profile'))

module.exports = router;