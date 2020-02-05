const express = require('express');
const router  = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
const mainAuth = require("../middlewares/protectMainRoute")

router.get("/", mainAuth, (req, res, next) => {
    res.render("main");
    next();
}
)

module.exports = router;
