const express = require('express');

const router = express.Router();

/* GET home page */
router.get('/', async (req, res, next) => {
    if (!req.session.currentUser) { res.render('index', { view: true, home: true }); }
    res.render('index', { logout: true, home: true });
});

router.use((req, res, nxt) => {
    if (!req.session.currentUser) { res.redirect('/login?sessionExpired=true'); return; }
    nxt();
});

router.get('/main', (req, res) => res.render('main', { logout: true, pages: true }));

router.get('/private', (req, res) => res.render('private', { logout: true, pages: true }));

module.exports = router;
