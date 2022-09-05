
const router = require('express').Router();


router.get('/private', (req, res) => {
    res.render('user/private');
});


router.get('/main', (req, res) => {
    res.render('user/main');
});


module.exports = router;