// 1. Impotaciones

const express = require("express")
const router = express.Router()

const authController = require("./../controllers/authController")

// Crear usuario

// Mostrar formulario

router.get("/signup", authController.viewRegister)

module.exports = router 