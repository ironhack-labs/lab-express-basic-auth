const router = require("express").Router()

/**
 * This router is prefixed with /profile
 */
router.get("/", (req, res) => {
	res.render("profile")
})

module.exports = router
