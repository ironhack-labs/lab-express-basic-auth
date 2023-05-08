const router = require("express").Router();

/* GET home page */
router.get("/profile", (req, res, next) => {
    res.render("user/profile", { user: req.session.currentUser });
});

module.exports = router;