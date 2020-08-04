
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs')

const UserModel = require("../models/User.model");

const app = require ('../app');

router.get("/main", (req,res) => {
    res.render("private/main.hbs");
});

router.get("/private", (req,res) => {
    res.render("private/private.hbs");
});


module.exports = router;