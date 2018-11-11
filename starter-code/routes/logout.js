const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
})

module.exports = router;