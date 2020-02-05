const express = require('express');
const router  = express.Router();
const protectRoute = require("../middlewares/protectRoute");

// ROUTES GLOBAL
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/main", protectRoute, (req, res) => {
  res.render("main");
});

router.get("/private", protectRoute, (req, res) => {
  res.render("private");
});

module.exports = router;
