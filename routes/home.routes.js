const router = require("express").Router();

const { isLoggedIn } = require('../middleware/route-guard');

/* GET home page */
router.get("/home", isLoggedIn, (req, res, next) => {
    console.log("You are in home now ;)");
    res.render("users/home");
});

module.exports = router;