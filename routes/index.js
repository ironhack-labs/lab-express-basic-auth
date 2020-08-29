const express = require("express")
const router = express.Router()
const { home, main, private, notLogged } = require("../controllers")

router.get("/", home)
router.get("/main", main)
router.get("/private", private)
router.get("/notLogged", notLogged)

module.exports = router
