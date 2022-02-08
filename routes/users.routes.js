const router = require("express").Router()
router.get("/profile", (req, res, next) => res.render("profile"))

module.exports = router