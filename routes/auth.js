const express = require("express")
const router = express.Router()

const authController = require("./../controllers/authController")

//show form:
router.get("/signup", authController.viewRegister)

//send user's data to DB
router.post("/signup", authController.register)

module.exports = router