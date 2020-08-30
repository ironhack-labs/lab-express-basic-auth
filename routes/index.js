const express = require("express")
const router = express.Router()
const { home, profile } = require("../controllers")

router.get("/", home)
router.get("/profile", profile)

module.exports = router