const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index', req.session.user));
router.post('/', (req, res) => {
    req.session.user = null
    res.redirect('/')
})

module.exports = router;