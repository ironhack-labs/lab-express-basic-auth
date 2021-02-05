const router = require("express").Router()

//require controllers
const userController = require("../controllers/user.controller")
const miscController = require("../controllers/misc.controller")


// home
router.get("/", miscController.index);


// auth_form 
router.get("/register", userController.register)
router.post("/register", userController.doRegister)


module.exports = router
