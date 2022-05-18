const router = require("express").Router();
const User = require("../models/User.model");
const { isLoggedIn } = require("../middlewares/auth.middlewares");

// main
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("auth/private");
});

module.exports = router;
