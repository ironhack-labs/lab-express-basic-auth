
// 1. IMPORTACIONES
const express		= require("express")
const router		= express.Router()


// // Me traigo el controller con su funcion (De esta forma puede saber que existe)
const usersController	= require("./../controllers/usersController")


// 2. RUTA 
router.get("/", usersController.register)


// 3. EXPORTACION
module.exports = router

