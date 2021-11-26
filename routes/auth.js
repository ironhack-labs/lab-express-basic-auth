const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
//REGISTRO
//Mostrar formulario
router.get("/signup", authController.viewRegister);

//Enviar datos del form a la DB
router.post("/signup", authController.register);

// INICIAR SESIÓN
// A. MOSTRAR EL FORMULARIO (GET)
router.get("/login", authController.viewLogin);

//B MANEJO DEL FORMULARIO, OBTENER DATA DEL FORM (POST)
//router.post('ruta', controlador.metodo)
router.post("/login", authController.login);

//CERRAR SESION

router.post("/logout", authController.logout);
module.exports = router;
