const express = require("express")
const router = express.Router()

const authController = require("./../controllers/authController")

//Formulario de creación de usuario

router.get("/signup", authController.viewRegister)
//Enviar datos a la Base.
router.post("/signup", authController.register)

// //Inicio de sesión
// //mostrar formulario
router.get("/login", authController.viewLogin)
// //manejo de formulario
router.post("/login", authController.login)


module.exports = router