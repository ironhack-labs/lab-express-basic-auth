const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");

const bcrypt = require("bcrypt");
// what those 10 mean is
const saltRounds = 10;

//render signup page
router.get("/signup", (req, res, next) => {
    res.render('/auth/signup/')
});

router.post("/signup", (req, res, next) => {
    const { username, password } = req.body;
});

module.exports = router;