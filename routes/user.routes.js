const router = require("express").Router();
const {isLoggedIn} =require("../middleware/route-guard")




router.get("/main",isLoggedIn, (req, res) => {
    res.render("user/cat-meme");
});
router.get("/private",isLoggedIn, (req, res) => {
    res.render("user/private");
});

module.exports = router;
