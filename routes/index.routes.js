const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('home'));

router.get('/main', (req, res, next) => {
    let activeUser = false;
    
    if (req.session.currentUser){ 
        activeUser = true;
    }
    res.render('main', {activeUser});
});

router.get('/private', (req, res, next) => {
    let activeUser = false;
    
    if (req.session.currentUser){ 
        activeUser = true;
    }
    res.render('private', {activeUser});
});

router.get('/private', (req, res, next) => res.render('private'));

module.exports = router;
