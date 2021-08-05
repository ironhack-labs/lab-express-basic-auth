const { Router } = require("express");
const router = new Router();
const { isLoggedIn, isLoggedOut } = require('../../middleware/route-guard.js');

router.get('/private', isLoggedIn, (req, res) => {
    res.render("private");
});

module.exports = router;