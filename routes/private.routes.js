// routes/private.routes.js
const { Router } = require('express');
const router = new Router();

// require auth middleware
const { isLoggedIn } = require('../middleware/route-guard.js')
router.get('/private', isLoggedIn, (req, res) => {
    res.render('private')
})


module.exports = router;