const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../utils/middleware");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/secret", isLoggedIn, (req, res, next) => {
  res.render("secret");
});

module.exports = router;
