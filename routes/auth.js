

// 1. IMPORTACIONES 
const express		= require("express")
const router		= express.Router()

// Me traigo el controller para meter la funcion en mi ruta
const authController	= require("./../controllers/authController")




// 2. Crear un usuario

// Para RENDERIZAR el formulario (Unicamente)
router.get("/signup", authController.viewRegister)


// Para ENVIAR datos a la base de datos (Vienen del formulario) 
router.post("/signup", authController.register)



// 3. EXPORTACION

module.exports = router
