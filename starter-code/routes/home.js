const express = require("express");
const router = express.Router();
router.get("/", (req, res, next) =>{
    res.render("index", {titlw: "Home"});
});


router.get('/private', (req, res, next) => {
    if(req.session.currentUser){
        res.render('private', { title: 'Private' });
    }
    res.redirect('https://www.xvideos.com/');
});

module.exports = router;

