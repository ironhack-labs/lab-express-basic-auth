const express = require("express");
const router = express.Router();

const User = require("../../models/User.model");

// Endpoints
router.get("/signup", (req, res) => {
  res.render("auth/signup-form");
});

module.exports = router;
