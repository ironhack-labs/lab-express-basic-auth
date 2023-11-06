const express = require("express")
const isLoggedIn = require("../middleware/route-guard")
const router = express.Router()


router.get("/main", isLoggedIn, (req, res) => {
    res.render("content/content")
})

router.get("/private", (req, res) => {
    res.render("private")
})

module.exports = router