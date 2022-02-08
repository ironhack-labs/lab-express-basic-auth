const express = require("express")
const router = express.Router()

const userController = require("./../controllers/userController.js")

//RUTAS

router.get("/register", userController.register)

router.post("/register", userController.registerForm)




//exportacion

module.exports = router