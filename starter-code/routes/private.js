const express = require('express');
const router  = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
const privateAuth = require("../middlewares/protectPrivateRoute")

router.get("/", privateAuth, (req, res, next) => {
    res.render("private");
    next();
}
)


module.exports = router;
