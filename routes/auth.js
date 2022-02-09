
//1 import

const express = require('express');
const router = express.Router()
const authController = require("./../controllers/authController")


//2 Router 
    //A1 Get page
router.get("/signUp",authController.signUp)

// A2. SIGNUP - Send data
router.post("/signUp", authController.signUpForm)

// B1. LOGIN - Get login
 router.get("/login", authController.login)

 //B2 LOGIN ENVIAR FORMULARIO DE LOGIN
router.post("/login",authController.loginForm)









module.exports = router;