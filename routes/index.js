// ./routes/index.js

// 1. IMPORTACIONES
const express			= require("express")
const router			= express.Router()

const indexController 	= require("./../controllers/indexController")
const userController    =require("./../controllers/userController")


// 2. ROUTER
// A. HOME
router.get("/", indexController.getHome)

//SINGUP
router.get("/register", userController.register)
router.post("/register", userController.registerForm)

//profile
router.get("/profile", userController.profile)

//LOGIN
router.get("/login", userController.login)


// 3. EXPORTACIÓN
module.exports = router 