const express = require("express")
const router = express.Router()

const authController = require("./../controllers/authController")

router.get("/register", authController.register)

router.post("/register", authController.registerForm)

router.get("/login", authController.login)

router.post("/login", authController.loginForm)

module.exports = router