
// 1. IMPORTACION
const express	= require("express")
const router	= express.Router()

// Me traigo el controller con su funcion (De esta forma puede saber que existe)
const indexController = require("./../controllers/indexController")


// 2. RUTA 
router.get("/", indexController.home)



// 3. EXPORTAR
module.exports = router

