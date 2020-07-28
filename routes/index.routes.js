const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

//I-3
//Middleware (access bridge) to hose with active sessions
//accesible to middleweare only if session is active
router.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('/auth/login');
    }
});

//I-3 if ther is a session, shows router.get and renders private.hbs
router.get('/private', (req, res, next) => res.render('private.hbs'));

//I-3 if ther is a session, shows router.get and renders main.hbs
router.get('/main', (req, res, next) => res.render('main.hbs'))

module.exports = router;