const router = require("express").Router();

/* GET home page */
router.get("/home", (req, res, next) => {
    res.render("index");
});


module.exports = router;