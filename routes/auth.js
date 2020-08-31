const express = require("express")
const router = express.Router()

const {
    signupView,
    signupProcess,
    loginView,
    loginProcess
  } = require("../controllers/auth")
  
  router.get("auth/signup", signupView)
  router.post("auth/signup", signupProcess)
  //login
  router.get("auth/login", loginView)
  router.post("auth/login", loginProcess)
  
  module.exports = router