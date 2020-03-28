const express = require("express"); 

const router = express.Router();

router.get("/", (req,res,next) => {
    res.render("home");
});


//Initial Route
router.use ((req, res, next) => {
    if (req.session.currentUser) {
        next(); 
    } else {
        res.redirect ("/login")
    }
})



//Next Route
router.get("/member", (req,res,next) => {
    res.render("member");
});


module.exports = router; 