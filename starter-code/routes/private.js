//login correcto
const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session.currentUser){
        res.render('private');
    }
    res.redirect('/main');
});

module.exports = router;



