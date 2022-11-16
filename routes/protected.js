const router = require('express').Router();
const { isLoggedIn } = require("../middleware/route-guards");

router.get('/protected/main', isLoggedIn, (req, res, next) => {
    const userId = req.session.user._id;

    res.render('main');
})

router.get('/protected/private', isLoggedIn, (req, res, next) => {
    
    res.render('private');
})


module.exports = router;