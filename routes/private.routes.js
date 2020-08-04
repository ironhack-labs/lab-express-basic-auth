const express = require('express');
const router = express.Router();

router.get('/main',(req,res)=>{
    res.render('private/main.hbs');
});
router.get('/private',(req,res)=>{
    res.render('private/private.hbs');
});
module.exports = router;