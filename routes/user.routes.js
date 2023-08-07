const express = require('express');
const { isLoggedIn } = require('../middlewares/route-guard');
const router = express.Router();

router.get('/private', isLoggedIn, (req, res) => {
    res.render("user/private")

})


module.exports = router