const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose"); 

const User = require("../models/User.model");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get("/userProfile/private", isLoggedIn, (req, res) => {
    res.render("users/private", { userInSession: req.session.currentUser });
  });

module.exports = router;