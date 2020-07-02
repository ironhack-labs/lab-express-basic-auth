const express = require('express');
const router = express.Router();

/* GET Main page */
router.get('/main', (req, res, next) => {
    const user = req.session.user
    return res.render('main')
});

module.exports = router;
