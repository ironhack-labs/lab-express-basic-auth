
// 1. IMPORTACIONES 
const express		= require("express")
const router		= express.Router()

// Me traigo el controller para meter la funcion en mi ruta
const authController	= require("./../controllers/authController")

// Me traigo los route-guards para implementarlos en mis rutas (Accesibilidad a ciertas partes de mi pagina dependiendo el estatus del usuario)
const routeGuard = require("./../middlewares/route-guards")
// PENDIENTE VER SI AFECTA GUARDS EN MI ARCHIVO


// 2. Crear un usuario

// a) Para RENDERIZAR el formulario (Unicamente)
router.get("/signup", routeGuard.usuarioNoLoggeado, authController.viewRegister)

// b) Para ENVIAR datos a la base de datos (Vienen del formulario) 
router.post("/signup", routeGuard.usuarioNoLoggeado, authController.register)



// 3. Iniciar sesion ()

// a) Mostar visualmente el formulario para iniciar sesion
router.get("/login", routeGuard.usuarioNoLoggeado, authController.viewLogin)

// b) Manejo de los datos enviados al iniciar sesion
router.post("/login", routeGuard.usuarioNoLoggeado, authController.login)




// 4. Cerrar sesion (Route-gard, unico que lleva el usuarioLoggeado)
router.post("/logout", routeGuard.usuarioLoggeado, authController.logout)






// 3. EXPORTACION

module.exports = router
