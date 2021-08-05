const { Router } = require("express");
const router = new Router();
const { isLoggedIn, isLoggedOut } = require('../../middleware/route-guard.js');

router.get('/main', isLoggedIn, (req, res) => {
    res.render("main");
});

module.exports = router;