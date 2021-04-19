const express = require("express");
const router = express.Router();

router.get("/main", (req, res) => {
	res.render("main", { user: req.session.currentUser });
});

router.get("/private", (req, res) => {
	res.render("private", { user: req.session.currentUser });
});

module.exports = router;
