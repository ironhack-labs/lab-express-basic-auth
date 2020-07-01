const express = require('express');
const router = express.Router();

// Middleware:
const checkLogin = () => {
    return (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}


router.get('/', (req, res, next) => res.render('index'));

router.get('/profile', checkLogin(), (req, res, next) => {
    res.render('profile')
})

module.exports = router;
