const express = require('express');
const router = express.Router();
const {userLogin, private} = require("../controllers/auth.controller")


router.get("/", userLogin, private )

module.exports = router