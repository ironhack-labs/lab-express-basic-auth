const router = require('express').Router();


const isLoggedIn = require('./loggedin');



router.get('/main', isLoggedIn, (req, res, next) => {
    const user = req.session.currentUser;
    res.render('private/main', user)
});

router.get('/private', isLoggedIn, (req, res, next) => {
    const user = req.session.currentUser;
    res.render('private/private', user)
});


module.exports = router;