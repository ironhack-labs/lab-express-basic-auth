const router = require("express").Router();
const { isLoggedIn } = require("../middleware/route-guard");

// Get user profile home package
router.get("/user/profile", isLoggedIn, (req, res, next) => {
    const { user } = req.session;
    console.log(user);
    res.render("user/profile", user);
});

module.exports = router;