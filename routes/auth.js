//--------------------  IMPORTACIONES   -------------------------/
const express = require("express")
const router = express.Router()

const authController = require("./../controllers/authController")

const routeGuard = require ("./../middlewares/route-Guard")
//AGREGAR ROUTEGUARD AQUÍ Y EDITAR RUTAS ABAJO !



//----------------------  RUTAS  ------------------------//

//CREAR USUARIO
//a. mostrar el formulario
router.get("/signup", routeGuard.usuarioNoLoggeado, authController.viewRegister)

//b. enviar datos a la Base
router.post("/signup", routeGuard.usuarioNoLoggeado, authController.register)


//INICIAR SESIÓN
//a. mostrar el form
router.get("/login", routeGuard.usuarioNoLoggeado, authController.viewLogin)

//b. manejo del formulario
router.post("/login", routeGuard.usuarioNoLoggeado, authController.login)


//CERRAR SESION
//manejo de formulario
router.post("/logout", routeGuard.usuarioLoggeado, authController.logout)




//EXPORTACIÓN
module.exports = router