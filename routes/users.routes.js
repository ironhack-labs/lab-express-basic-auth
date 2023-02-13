const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/route-guard')



router.get('/main', isLoggedIn, (req, res, next) => {
    res.render('main', { user: req.session.currentUser })
})
router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('private', { user: req.session.currentUser })
})

module.exports = router