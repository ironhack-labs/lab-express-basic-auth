// ./routes/auth.js

const express		= require("express")
const router		= express.Router()

const authController	= require("./../controllers/authController")


// CREAR USUARIO
// MOSTRAR EL FORMULARIO
router.get("/signup", authController.viewRegister)
// ENVIAR DATOS A LA BD QUE VIENEN DEL FORMULARIO
router.post("/signup", authController.register)

module.exports = router