const express = require('express')
const router = express.Router()

const authController = require("./../controllers/authController")
const routeGuard = require('./../middlewares/route-guard')
/* const mainController = require("./../controllers/mainController") */

//Creamos el usuario y mostramos el formulario.
router.get("/signup", routeGuard.usuarioNoLoggeado,authController.viewRegister);
router.post("/signup", routeGuard.usuarioNoLoggeado,authController.register)

//Iniciamos sesion
//Mostramos formulario
router.get('/login', routeGuard.usuarioNoLoggeado, authController.viewLogin)
//Manejamos el formulario
router.post('/login', routeGuard.usuarioNoLoggeado, authController.login)
router.post('/logout', routeGuard.usuarioLoggeado, authController.logout)


module.exports = router