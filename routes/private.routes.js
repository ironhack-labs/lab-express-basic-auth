const { isLoggedIn } = require("../middlewares/route.guard");

const router = require("express").Router();

router.get("/profile", isLoggedIn, (req, res, next) => {
    res.render("user/profile", { user: req.session.currentUser })
})
router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("user/main", { user: req.session.currentUser })
})
module.exports = router


