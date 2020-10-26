const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.use((req,res,next)=>{
    if(req.session.currentUser){
        next();
    }else{
        res.redirect('/login');
    }
});

router.get('/private', (req,res,next)=> res.render('private'));

module.exports = router;
