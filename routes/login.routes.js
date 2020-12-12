const express = require('express');
const router = express.Router();
const {login, showFormLogin} = require("../controllers/auth.controller")


router.get("/", showFormLogin).post("/", login)

module.exports = router