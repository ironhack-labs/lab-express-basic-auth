const express = require("express")
const router = express.Router()

// ahora mantenemos una separacion de 'controladores' en su archivo individial
// por lo que este archivo de rutas solo contiene eso... rutas con su respectivo controller
//  👇 importamos los controladores
const {
    signupView,
    signupProcess,
    loginView,
    loginProcess
} = require("../controllers/auth")

router.get("/", signupView)
router.post("/signup", signupProcess)
    //login
router.get("/", loginView)
router.post("/login", loginProcess)

module.exports = router