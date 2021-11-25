// 1. Impotaciones

const express = require("express")
const router = express.Router()

const authController = require("./../controllers/authController")

const routeGuard = require("./../middlewares/route-guard")

// Crear usuario
// Mostrar formulario
router.get("/signup", routeGuard.usuarioNoLoggeado, authController.viewRegister)

// Enviar datos a la BD del formulario.
router.post("/signup", routeGuard.usuarioNoLoggeado, authController.register)

// Iniciar sesión.
// a. Mostrar el formulario.
router.get("/login", routeGuard.usuarioNoLoggeado, authController.viewLogin)

// b. Manejo del formulario.
router.post("/login", routeGuard.usuarioNoLoggeado, authController.login)

// Cerrar sesión.
router.post("/logout", routeGuard.usuarioLoggeado, authController.logout)

// Exportaciones.
module.exports = router 