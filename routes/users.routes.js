

const router = require("express").Router();

const { isLoggedIn } = require('./../middleware/route-guard')


router.get("/perfil", (req, res, next) => {
    res.render("users/user-profile", { user: req.session.currentUser });
});

// MAIN SESSION
router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("users/user-main", { user: req.session.currentUser })
})

// PRIVATE SESSION
router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("users/user-private", { user: req.session.currentUser })
})

module.exports = router;