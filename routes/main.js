const express = require("express");

const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main");
});

module.exports = router;
