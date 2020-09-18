const express = require('express');

const router = express.Router();

/* GET home page */
router.get('/', async (req, res, next) => {
    if (!req.session.currentUser) { res.render('index', { view: true }); }
    res.render('index');
});

router.use((req, res, nxt) => {
    if (!req.session.currentUser) { res.redirect('/login?sessionExpired=true'); return; }
    nxt();
});

router.get('/main', (req, res) => res.render('main'));

router.get('/private', (req, res) => res.render('private'));

module.exports = router;
