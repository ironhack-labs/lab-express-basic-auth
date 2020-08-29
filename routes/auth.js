const express = require("express")
const router = express.Router()

const {
  signupView,
  signupProcess,
  loginView,
  loginProcess
} = require("../controllers/auth")

router.get("/signup", signupView)
router.post("/signup", signupProcess)

//login
router.get("/login", loginView)
router.post("/login", loginProcess)

module.exports = router
