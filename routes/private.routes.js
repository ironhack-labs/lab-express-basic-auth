const express = require('express');
const router = express.Router();

/* GET Private page */
router.get('/private', (req, res, next) => {
    const user = req.session.user
    return res.render('private', { user })
});

module.exports = router;
