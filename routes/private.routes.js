const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/route-guard");

router.get("/", isLoggedIn, (req, res, next) => {
  res.render("private");
});

module.exports = router;
