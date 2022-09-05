const isLogedin = require('../middleware/is_logedin.middleware');

const router = require('express').Router();


router.get('/', (req, res) => {
    res.render('/private');
});
router.get('/private', (req, res) => {
    res.render('private');
});
router.get('/main', (req, res) => {
    res.render('main');
});


module.exports = router;