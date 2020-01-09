const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("home");
});

router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
        next(); // ==> go to the next route ---
    } else {                          //    |
        res.redirect("/login");         //    |
    }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
router.get("/private", (req, res, next) => {
    res.render("private");
});

router.get("/main", (req, res, next) => {
    res.render("main");
});

module.exports = router;