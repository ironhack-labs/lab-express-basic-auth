const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
    if (req.session.currentUser){
        console.log("Logged!")
        console.log("asadsad" + req.session.currentUser.email)
        res.render("auth/index", {
            user: req.session.currentUser
        })
    }
    else {
        console.log("not logged!")
        console.log("asadsad")
        res.render("index")
    }
    
    
});

module.exports = router;
