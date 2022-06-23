const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose"); 

const User = require("../models/User.model");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get("/userProfile/main", isLoggedIn, (req, res) => {
    res.render("users/main", { userInSession: req.session.currentUser });
  });

  
module.exports = router;