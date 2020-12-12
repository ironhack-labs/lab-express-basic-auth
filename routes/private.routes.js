const express = require('express');
const router = express.Router();
const {userLogin, private} = require("../controllers/auth.controllers");


router.get("/", userLogin, private);

module.exports = router;