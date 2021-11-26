//1. IMPORT
const router = require("express").Router();

const authController    = require("./../controllers/auth.Controller")
const routeGuard        = require("./../middlewares/route-guard")



//CREAR
//Crear Log VISTA (Para el formulariio)
router.get("/signup", routeGuard.usuarioNoLoggeado, authController.viewRegister)
//Enviar datros a la BD que vienen del formulario
router.post("/signup", routeGuard.usuarioNoLoggeado, authController.register)

//Iniciar Sesion
//VIEW
router.get("/login", routeGuard.usuarioNoLoggeado, authController.viewLogin)
//FORM
router.post("/login", routeGuard.usuarioNoLoggeado, authController.login)


//CERRAR SESION
router.post("/logout",routeGuard.usuarioLoggeado, authController.logout)

// 3. Exportaciones
module.exports = router;
