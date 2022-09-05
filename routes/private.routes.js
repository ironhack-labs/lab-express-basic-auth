const router = require('express').Router();
const isLogedin = require('../middleware/is_logedin.middleware');

router.get('/private', isLogedin, (req, res) => {

    res.render('private');
});

router.get('/main', isLogedin, (req, res) => {

    res.render('main');
});

module.exports = router;