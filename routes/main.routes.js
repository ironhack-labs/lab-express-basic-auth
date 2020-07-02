const express = require('express');
const router = express.Router();

/* GET Main page */
router.get('/main', (req, res, next) => {
    const user = req.session.user
    if (!user) return res.redirect('/login')
    return res.render('main')
});

module.exports = router;
