const router = require('express').Router();

router.get('/profile', (req, res) => {
    const user = req.session.user;
    res.render('user/private');
})

router.get('/main', (req, res) => {
    const user = req.session.user;
    res.render('user/main');
})












module.exports = router;