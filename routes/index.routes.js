const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/counter', (req, res, next) => {
    if(req.session.user) {
        res.send('you are logged in')
    } else {
        res.redirect('/auth/login')
    }
})

module.exports = router;
