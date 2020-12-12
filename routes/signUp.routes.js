const express = require('express');
const router = express.Router();
const {showFormSignUp, signUp} = require("../controllers/auth.controller")


router.get("/", showFormSignUp).post("/", signUp)

module.exports = router