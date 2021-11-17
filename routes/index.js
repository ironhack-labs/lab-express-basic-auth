const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
    res.render("index");
});

router.get("/main", (req, res, next) => {
    res.render("main/index");
})

const protectRoute = () => {
    return (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect("/");
        }
    }
}

router.get("/private", protectRoute(), (req, res, next) => {
    res.render("private/index");
})
module.exports = router;
