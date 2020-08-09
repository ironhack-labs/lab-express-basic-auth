const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

router.get("/main", (req, res, next) => {
	res.render("user-views/main", { userInSession: req.session.currentUser });
});

router.get("/private", (req, res, next) => {
	res.render("user-views/private", { userInSession: req.session.currentUser })
});

module.exports = router;
