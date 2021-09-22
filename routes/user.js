const express           = require("express")
const router            = express.Router()

const userController    = require("./../Controller/userController")



router.get("/profile", userController.createProfile)


module.exports = router