const express = require("express");

const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});

module.exports = router;
