const express = require("express")
const router = express.Router()

const authController = require("./../controllers/authController")
const routeGuard = require("./../middlewares/route-guards")

//show form:
router.get("/signup", routeGuard.noLoggedUser , authController.viewRegister)

//send user's data to DB
router.post("/signup", routeGuard.noLoggedUser, authController.register)

// LOGIN SESSION
//Send form to first login
router.get("/login", routeGuard.noLoggedUser, authController.viewLogin)

router.post("/login", routeGuard.noLoggedUser, authController.login)

//LOGOUT SESSION
//close user session
router.post("/logout", routeGuard.loggedUser, authController.userLogout)

module.exports = router