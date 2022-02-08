// ./routes/auth.js

// 1. IMPORTACIONES
const express		= require("express")
const router		= express.Router()

const authController		= require("./../controllers/authController")

// 2. ROUTER
// A1. SIGNUP - OBTENER PÁGINA
router.get("/signup", authController.signup)

// A2. SIGNUP - ENVIAR FORMULARIO
router.post("/signup", authController.signupForm)

// B. LOGIN - OBTENER PÁGINA
router.get("/login", authController.login)

// B2. LOGIN - ENVIAR FORMULARIO
router.post("/login", authController.loginForm)



// 3. EXPORTACIÓN
module.exports = router