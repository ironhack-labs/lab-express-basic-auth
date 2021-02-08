const router = require("express").Router()

//require controllers
const userController = require("../controllers/user.controller")
const miscController = require("../controllers/misc.controller")

//middlewares
const secure = require('../middlewares/secure.middleware')


// home
router.get("/", miscController.index);


// auth_form 
router.get("/register", secure.isNotAuthenticated, userController.register)
router.post("/register", secure.isNotAuthenticated, userController.doRegister)

// auth_form 
router.get("/login", secure.isNotAuthenticated, userController.login)
router.post("/login", secure.isNotAuthenticated, userController.doLogin)

//profile
router.get('/profile', secure.isAuthenticated, userController.profile)

//logout
router.post('/logout', secure.isAuthenticated, userController.logout)


module.exports = router
