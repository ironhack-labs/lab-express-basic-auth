const express		= require("express")
const router		= express.Router()

const authController	= require("./../controllers/authController")

const routeGuard		= require("./../middlewares/route-guard")


// 1.- CREAR USUARIO
// Renderiza el formulario de "signup" creado en (signup.hbs)
router.get("/signup", routeGuard.usuarioNoLoggeado, authController.viewRegister)
// Permite crear un registro y mandar los datos del FORM a la BD
router.post("/signup", routeGuard.usuarioNoLoggeado, authController.register)

// 2.- INICIAR SESIÓN
// Renderiza el formulario de "login" creado en (login.hbs)
router.get("/login",  routeGuard.usuarioNoLoggeado, authController.viewLogin)
//Permite logear a un usuario para generar una session en BD
router.post("/login", routeGuard.usuarioNoLoggeado, authController.login)

//3.- CERRAR SESIÓN
//Permite cerrar la sesión del usuario
router.post("/logout", routeGuard.usuarioLoggeado, authController.logout)



module.exports = router