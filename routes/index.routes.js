const { getRounds } = require('bcrypt');
const express = require('express');
const router = express.Router();

const loginCheck = () => {
    return (
        (req, res, next) => {
            if (req.session.user) {
                next();
            } else {
                res.render('auth/login', { message: 'This page is restricted to logged in users. Please do so to continue.' });
            }
        }
    )
}

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/profile', loginCheck(), (req, res, next) => {
    res.render('profile', req.session.user);
})

router.get('/main', loginCheck(), (req, res, next) => {
    res.render('main');
})

router.get('/private', loginCheck(), (req, res, next) => {
    res.render('private');
})

module.exports = router;
