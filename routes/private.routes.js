const router = require('express').Router();

router.get('/main', (req, res) => res.render('main', { currentUser: req.session.currentUser }));

router.get('/private', (req, res) => res.render('private-area', { currentUser: req.session.currentUser }));

module.exports = router;