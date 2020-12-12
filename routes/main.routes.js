const express = require('express');
const router = express.Router();
const {userLogin, main} = require("../controllers/auth.controllers");


router.get("/", userLogin, main);

module.exports = router;