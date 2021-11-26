//   IMPORTACIONES
const express		= require("express")
const router		= express.Router()
const authController	= require("./../controllers/authController")
const guardiaRutero		= require("./../middlewares/guardiaRutero.js")

// MOSTRAR EL FORMULARIO
router.get("/signup", guardiaRutero.usuarioNoLoggeado, authController.viewRegister)

// ENVIAR DATOS A LA BD QUE VIENEN DEL FORMULARIO
router.post("/signup", guardiaRutero.usuarioNoLoggeado, authController.register)

module.exports = router

// INICIAR SESIÓN
// A. FORMULARIO
router.get("/login", guardiaRutero.usuarioNoLoggeado, authController.viewLogin)
// B. POST DEL FORMULARIO
router.post("/login", guardiaRutero.usuarioNoLoggeado, authController.login)

// CERRAR SESIÓN
router.post("/logout", guardiaRutero.usuarioLoggeado, authController.logout)