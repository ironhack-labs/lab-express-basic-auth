// 1. Importación

const express = require("express")
const router = express.Router()

const usersController = require("./../controllers/usersController")

const routeGuard = require("./../middlewares/route-guard")
console.log("El routeguard importado es: ", routeGuard.usuarioLoggeado)

// 2. Rutas.
router.get("/profile", routeGuard.usuarioLoggeado, usersController.profile)

// 3. Exportación.

module.exports = router