const router = require ('express').Router()
const authController = require('../controllers/auth.controller')
const usersController = require("../controllers/users.controller")
const miscController = require ("../controllers/misc.controller")

//MISCELANEUS
router.get("/", miscController.home)

//AUTH
router.get("/register", authController.register)
router.post("/register", authController.doRegister)

//USERS
router.get("/profile", usersController.profile)

module.exports = router