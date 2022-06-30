const router = require("express").Router(); 
const User = require("../models/User.model"); 
const bcrypt = require("bcryptjs");

// GET private 
router.get("/private", (req, res, next) => {
    res.render("private");
})

module.exports = router; 