const express = require("express")
const router = express.Router()

const isLoggedIn = require("../middleware/route-guard")

router.get("/main", (req, res) => {
    res.render("main")
})

router.get("/private", isLoggedIn, (req, res) => {
    res.render("private")
})


module.exports = router

