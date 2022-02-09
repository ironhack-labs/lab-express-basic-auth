const express     = require("express")
const router      = express.Router()

const indexController = require("../controllers/indexController")

router.get("/", indexController.getHome)

router.get("/profile", indexController.getProfile)

module.exports = router;
