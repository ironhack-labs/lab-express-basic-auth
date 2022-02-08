// ./routes/auth.js

// 1. IMPORTACIONES
const express		= require("express")
const router		= express.Router()

const authController		= require("./../controllers/authController")

// 2. ROUTER
// A1. SIGNUP - OBTENER PÁGINA
router.get("/register", authController.register)

// A2. SIGNUP - ENVIAR FORMULARIO
router.post("/register", authController.registerForm)


// 3. EXPORTACIÓN
module.exports = router