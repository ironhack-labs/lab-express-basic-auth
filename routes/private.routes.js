const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middlewares/route-guard')
router.get('/private', isLoggedIn, (req, res) => {
    res.render('private')
})


module.exports = router