const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("home.hbs");
});



// all the routes after this home-made middleware will need authentication to be accessed
// (they require us to have defined a currentUser in the session)

router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
        next(); // ==> go to the next route ---
    } else { //    |
        res.redirect("/login"); //    |
    } //    |
}); // ------------------------------------                                
//     | 
//     V
router.get("/main", (req, res, next) => {
    res.render("main.hbs");
});

router.get('/private', (req, res, next) => {
    res.render('private.hbs');
});

module.exports = router;