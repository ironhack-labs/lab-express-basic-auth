const express = require('express');
const router = express.Router();
const {showFormSignUp, signUp} = require("../controllers/auth.controllers");


router.get("/", showFormSignUp).post("/", signUp);

module.exports = router; 