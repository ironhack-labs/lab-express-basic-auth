const express		= require("express")
const router		= express.Router()

const usersController	= require("./../controllers/usersController")


router.get("/", usersController.register)


module.exports = router