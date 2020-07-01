const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/private', (req, res, next) => {
    const user = req.session.user
    if (!user) return res.redirect('/login')
    return res.render('private')
});

module.exports = router;
