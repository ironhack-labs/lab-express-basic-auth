const express = require("express");
const router = express.Router();

// Home 
router.get("/", (req, res, next) => {
    res.render("index");
  });

module.exports = router;