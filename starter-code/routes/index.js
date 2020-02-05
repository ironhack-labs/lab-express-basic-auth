const express = require("express");
const router = express.Router();
const restrictAccess = require("../middlewares/restrictAccess");

/* GET home page */
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/main", restrictAccess, (req, res) => {
  res.render("main");
});

router.get("/private", restrictAccess, (req, res) => {
  res.render("private");
});

module.exports = router;
