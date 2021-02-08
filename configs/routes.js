const router = require("express").Router()

//require controllers
const userController = require("../controllers/user.controller")
const miscController = require("../controllers/misc.controller")


// home
router.get("/", miscController.index);


// auth_form 
router.get("/register", userController.register)
router.post("/register", userController.doRegister)

// auth_form 
router.get("/login", userController.login)
router.post("/login", userController.doLogin)

//profile
router.get('/profile', userController.profile)

//logout
router.post('/logout', userController.logout)


module.exports = router
