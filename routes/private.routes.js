const { isLoggedIn } = require("../middlewares/route.guard");

const router = require("express").Router();

router.get("/profile", isLoggedIn, (req, res, next) => {
    const user = req.session.currentUser
    res.render("user/profile", { user }) //mejorar con destructuracion
})
router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("user/main", { user: req.session.currentUser }) //mejorar con destructurracion :)
})
module.exports = router


