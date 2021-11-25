const express = require("express")
const router = express.Router()

const authController = require("./../controllers/authController")

//crear user
router.get("/signup", authController.viewRegister)

//enviar datos a la Base
router.post("/signup", authController.register)

module.exports = router