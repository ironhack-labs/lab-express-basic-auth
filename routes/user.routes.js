const isLoggedIn = require('../middleware/isLoggedIn.middleware')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('user/index', req.session.user)
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    });
})

router.get('/main', (req, res) => {
    res.render('user/main')
})

router.get('/private', (req, res) => {
    res.render('user/private')
})

module.exports = router