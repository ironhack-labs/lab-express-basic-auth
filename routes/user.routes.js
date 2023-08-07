const express = require('express');
const { isLoggedIn } = require('../midllewares/route-guards');
const router = express.Router();


router.get('/cat', isLoggedIn, (req, res, next) => {
    res.render('private/cat')

})

router.get('/gif', isLoggedIn, (req, res, next) => {
    res.render('private/gif')

})

module.exports = router;