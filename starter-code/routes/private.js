const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  if (req.session.currentUser) return res.render("private/private");
  res.redirect("auth/login");
});

module.exports = router;
