const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedOut, isLoggedIn } = require("../middleware/route-guard");
const saltRounds = 10;


router.get("/main", isLoggedOut, (req, res, next) => res.render("auth/main"));

module.exports = router