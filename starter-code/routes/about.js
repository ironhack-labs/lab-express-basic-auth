const express = require("express");
const router = express.Router();

/* Sign-up page */
router.get("/about", (req, res, next) => {
  res.render("about");
});

module.exports = router;