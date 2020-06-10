const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/main', (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/');
        return;
    }
    res.render('protected/main', req.session.currentUser)
});
router.get('/private', (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/')
    }
    res.render('protected/private', req.session.currentUser)
})
module.exports = router;