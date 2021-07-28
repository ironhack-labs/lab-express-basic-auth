const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");


router.get("/profile", requireAuth, function (req, res, next) {
	res.render("user/profile.hbs");
});

module.exports = router;