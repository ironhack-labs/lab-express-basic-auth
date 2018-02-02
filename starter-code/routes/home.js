const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home' });
});

router.get('/private', function(req, res, next) {
    if(req.session.currentUser){
        res.render('private', { title: 'Private' });
    }
    res.redirect('http://disney.com');
});

module.exports = router;