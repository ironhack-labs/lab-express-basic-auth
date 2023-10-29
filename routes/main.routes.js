// routes/main.routes.js
const { Router } = require('express');
const router = new Router();

// require auth middleware
const { isLoggedIn } = require('../middleware/route-guard.js')
router.get('/main', isLoggedIn, (req, res) => {
    res.render('main')
})


module.exports = router;