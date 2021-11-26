//1. IMPORTACION
const express		= require("express")
const router		= express.Router()

const usersController	= require("../controllers/users.Controller.js")

const routeGuard = require("./../middlewares/route-guard")

console.log("El route Guard importado es:", routeGuard.usuarioLoggeado) //<--[Function: usuarioLoggeado]

//2. RUTEO
//Tan pronto el routeGuard.usuarioLoggeado encuentre un next pasa a 👇  la sigueinte funcion
router.get("/main", routeGuard.usuarioLoggeado, usersController.main)

router.get("/private", routeGuard.usuarioLoggeado, usersController.private)




module.exports = router