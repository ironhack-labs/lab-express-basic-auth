const express = require('express');
const { route } = require('./auth');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

const loginCheck = () => {
    return (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/login')
        }
    }
}

router.get('/profile', loginCheck(), (req, res, next) => {
    console.log('this is the cookie: ', req.cookies);
    console.log('This is the logged in user: ', req.session.user);
    res.render('profile');
})

router.get('/main', (req, res, next) => {
    res.render('main')
})

router.get('/private', loginCheck(), (req, res, next) => {
    res.render('private')
})


router.get('/logout', (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.redirect('/');
        }
    })
});

module.exports = router;
