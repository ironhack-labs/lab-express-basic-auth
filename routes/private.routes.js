const express = require('express');
const router = express.Router();

const isLoggedIn = (req, res, next) => {
    if(req.session.currentUser) next()
    else res.redirect('/main')
}

router.get('/', isLoggedIn,  (req, res, next) => {
    res.render('private');
})

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { user: req.session.currentUser });
})

module.exports = router;