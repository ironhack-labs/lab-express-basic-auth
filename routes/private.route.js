const express = require("express");
const router = express.Router();

/* GET main page */
router.get("/", (req, res) => {
  res.render("private", { userLoggedIn: req.session.currentUser });
});

module.exports = router;
