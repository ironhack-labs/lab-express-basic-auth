
//1 import

const express = require('express');
const router = express.Router()
const authController = require("./../controllers/authController")


//2 Router 
    //A.1 Get page
router.get("/signUp",authController.signUp)

// A2. SIGNUP - Send data
router.post("/signUp", authController.signUpForm)

// B. LOGIN - Get login
// router.get("/login", authController.login)






module.exports = router;