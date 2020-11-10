const express = require('express');
const router = express.Router();
// getting bcrypt
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { route } = require('../app');

/* GET home page */
router.get('/', (req, res, next) => {
    console.log(req.session)
    // to check how many times is request 
    if (req.session.count) {
        req.session.count += 1
    } else {
        req.session.count = 1
    }

    console.log(req.session.count)
    res.render('index')
});

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', async (req, res,) => {
    const { email, password } = req.body
    if (email === '' || password === '') {
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
    const { email, password } = req.body
    if (email === '' || password === '') {
        return res.render('auth/login', { error: 'Missing fields' })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.render('auth/login', { error: 'something went wrong' })
    }
    if (bcrypt.compareSync(password, user.password)) {
      
        return res.render('auth/profile', user)
        // cant make it log out
        // this.delete.user.password
        // req.session.currentUser = email
        // res.redirect('/profile')
    }
    else {
        return res.render('auth/profile', { error: 'something went wrong' })
    }
    res.redirect('/profile')

})


router.get('/profile', (req, res, next) => {
    res.render('auth/profile', {
        user: req.session.currentUser
    })
}),

    router.get('/profile', (req, res, next) => res.render('auth/profile'));

router.get('/logout', (req, res) =>{
    req.session.destroy()
    res.redirect('/')
})

module.exports = router;
