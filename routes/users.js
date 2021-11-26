
//importaciones

const express   = require("express")
const router = express.Router()
const usersController = require("../controllers/usersController")

//ruteo
router.get("/profile", usersController.profile)

module.exports = router