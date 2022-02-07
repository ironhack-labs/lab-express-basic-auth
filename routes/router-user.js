const router = require("express").Router();

const { userIsLoggedIn } = require('./../middleware/route-guard')


router.get("/user/main", userIsLoggedIn, (req, res, next) => {
    res.render("user/main")
});

router.get("/user/private", userIsLoggedIn, (req, res, next) => {
    res.render("user/private")
});

module.exports = router;