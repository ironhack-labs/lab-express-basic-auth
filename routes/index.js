const express = require('express');
const router = express.Router();
// getting bcrypt
const bcrypt = require('bcrypt');
const User = require('../models/user');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', async (req, res,) => {
    const { username, password } = req.body
    if (username === '' || password === '') {
        res.render('auth/signup', { error: 'missing fields' })
    } else {
        const user = await User.findOne({ email })
        if (user) {
            return res.render('auth/signup', { error: 'something went wrong' })
        }
        
        const salt = bcrypt.genSaltSync(12)
        const haspwd = bcrypt.hashSync(password, salt)
        await User.create({
            email,
            password: haspwd,
        })
        res.redirect('/profile')

    }
});

router.get('/login', (req, res, next) => res.render('auth/login'));

router.post('/login', async (req, res, next) => {
    // res.send(req.body)
    const { username, password } = req.body
    if (username === '' || password === '') {
        res.render('auth/login', { error: 'Missing fields' })
    }
    const user = await User.findOne({ email })
    if (!user) {
        res.render('auth/login', { error: 'something went wrong' })
    }
    if (bcrypt.compareSync(password, user.password)) {
        res.render('auth/profile', user)
    }
    else {
        res.render('auth/login', { error: 'something went wrong' })
    }

})


router.get('/profile', (req, res, next) => res.render('auth/profile')),

    module.exports = router;
