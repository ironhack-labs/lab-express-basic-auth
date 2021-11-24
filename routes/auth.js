// 1. Impotaciones

const express = require("express")
const router = express.Router()

const authController = require("./../controllers/authController")

// Crear usuario

// Mostrar formulario

router.get("/signup", authController.viewRegister)

// Enviar datos a la BD del formulario.
router.post("/signup", authController.register)

module.exports = router 