const express = require('express');
const router = express.Router();
const {userLogin, main} = require("../controllers/auth.controller")


router.get("/", userLogin, main)

module.exports = router