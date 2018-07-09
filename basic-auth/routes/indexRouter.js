const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/',(req,res) => {
    res.render('index');
})

router.get('/private',(req,res) => {
    if(req.session.currentUser){
        res.render('private');
    }else{
        res.redirect('/');
    }
})
router.get('/main',(req,res) => {
    if(req.session.currentUser){
        res.render('main');
    }else{
        res.redirect('/');
    }
})

module.exports = router;