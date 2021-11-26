// ------------------------  IMPORTACIONES  ---------------------------//
const express = require ("express")
const router = express.Router()

const usersController = require ("./../controllers/usersControllers")

const routeGuard = require("./../middlewares/route-Guard")
console.log("El routeguard importado es:", routeGuard.usuarioLoggeado)


//--------------------------------   RUTEO   -----------------------------//
router.get("/profile", routeGuard.usuarioLoggeado, usersController.profile)



//--------------------------  EXPORTACIONES ---------------------------//
module.exports = router