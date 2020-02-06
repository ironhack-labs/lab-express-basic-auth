const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  req.session.currentUser = null;
  return res.redirect("/");
});

module.exports = router;
