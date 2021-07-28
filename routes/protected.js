var express = require("express");
var router = express.Router();
const requireAuth = require("../middleware/proroutes");

router.get("/main", requireAuth, function(req, res, next) {
    res.render("main.hbs");
});

router.get("/private", requireAuth, function(req, res, next) {
    res.render("private.hbs");
});

module.exports = router;