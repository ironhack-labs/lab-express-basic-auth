const router = require("express").Router()
const isLoggedIn = require('../middlewares/isLoggedIn');
/**
 * This router is prefixed with /profile
 */
router.get("/", isLoggedIn, (req, res) => {
	res.render("profile");
});

module.exports = router;
