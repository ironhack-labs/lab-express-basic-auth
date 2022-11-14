const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/loggedin-middleware");

// Profile

router.get("/profile", isLoggedIn, (req, res) => {
	res.render("user/profile", { user: req.session.currentUser });
});

// Main page

router.get("/main", isLoggedIn, (req, res) => {
	res.render("user/main");
});

module.exports = router;
