const { isLoggedIn } = require("../middlewares/route-guard");


const router = require("express").Router();

router.get("/private/welcome", isLoggedIn, (req, res, next) => {
    res.render("private/welcome");
});

module.exports = router;
