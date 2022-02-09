// ./routes/index.js

// 1. IMPORTACIONES
const express			= require("express")
const router			= express.Router()

const indexController 	= require("./../controllers/indexController")


// 2. ROUTER
// A. HOME
router.get("/", indexController.getHome)

// B. PROFILE
router.get("/profile", indexController.getProfile)

// 3. EXPORTACIÓN
module.exports = router