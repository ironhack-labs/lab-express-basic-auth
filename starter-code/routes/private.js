const express = require("express");
const router = express.Router();
const protectRoute = require("../middlewares/protectRoute");

router.get("/",protectRoute, (req, res, next) => {
  res.render("private");
});

module.exports = router;