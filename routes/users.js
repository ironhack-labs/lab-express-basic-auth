
// 1. IMPORTACIONES
const express		= require("express")
const router		= express.Router()


// // Me traigo el controller con su funcion (De esta forma puede saber que existe)
const usersController	= require("./../controllers/usersController")

// Me traigo el route-guard para implementarlo en mi ruta de profile
const routeGuard = require("./../middlewares/route-guards")


// 2. RUTA 
/* router.get("/", usersController.register) */
router.get("/profile", routeGuard.usuarioLoggeado, usersController.profile)



// 3. EXPORTACION
module.exports = router

