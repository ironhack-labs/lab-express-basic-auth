const express = require("express")
const router = express.Router()

const userController = require("./../controllers/userController")
const routeGuard = require ("./../middlewares/route-guards")
router.get("/userProfile", routeGuard.loggedUser, userController.profile)
router.get("/homeUser", routeGuard.loggedUser, userController.usersHome)

module.exports = router