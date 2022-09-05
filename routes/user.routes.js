const router = require('express').Router();
const isLogedin = require('../middleware/is_logedin.middleware');


router.get('/', isLogedin, (req, res) => {
    const user = req.session.user
    res.render('auth/profile', user);
});

router.get('/main', isLogedin, (req, res) => {
    const user = req.session.user
    res.render('auth/main', user);
});

router.get('/private', isLogedin, (req, res) => {
    const user = req.session.user
    res.render('auth/private', user);
});


module.exports = router;
