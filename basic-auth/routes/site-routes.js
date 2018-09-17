const express = require("express");
const router = express.Router();


router.use((req, res, next) => {
	if (req.session.currentUser) {
		next();
	} else {
		res.redirect("/login");
	}
});


router.get("/", (req, res, next) => {
	res.render("home");
});

//Protect '/secret' route
router.use((req, res, next) => {
	if (req.session.currentUser) {
		next();
	} else {
		res.redirect("/login");
	}
});

router.get("/secret", (req, res, next) => {
	res.render("secret");
});

//Protect '/secret/main"' route
router.use((req, res, next) => {
	if (req.session.currentUser) {
		next();
	} else {
		res.redirect("/login");
	}
});

router.get("/secret/main", (req, res, next) => {
	res.render("auth/main");
});

//Protect '/secret/private"' route
router.use((req, res, next) => {
	if (req.session.currentUser) {
		next();
	} else {
		res.redirect("/login");
	}
});

router.get("/secret/private", (req, res, next) => {
	res.render("auth/private");
});

module.exports = router;