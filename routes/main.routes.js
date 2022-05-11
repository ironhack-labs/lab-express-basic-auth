const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

router.get("/profile/main", isLoggedIn, (req, res, next) => {
  res.render("user/main", { user: req.session.currentUser });
});

module.exports = router;
