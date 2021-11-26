const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const routeGuard = require("./../middlewares/route-guard");
//REGISTRO
//Mostrar formulario
router.get("/signup", routeGuard.usuarioInvitado, authController.viewRegister);

//Enviar datos del form a la DB
router.post("/signup", routeGuard.usuarioInvitado, authController.register);

// INICIAR SESIÓN
// A. MOSTRAR EL FORMULARIO (GET)
router.get("/login", routeGuard.usuarioInvitado, authController.viewLogin);

//B MANEJO DEL FORMULARIO, OBTENER DATA DEL FORM (POST)
//router.post('ruta', controlador.metodo)
router.post("/login", routeGuard.usuarioInvitado, authController.login);

//CERRAR SESION

router.post("/logout", routeGuard.usuarioLoggeado, authController.logout);
module.exports = router;
