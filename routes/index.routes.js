const express = require('express');
const router = express.Router();
const { isLoggedIn } = require("../middleware/route-guard")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  const user = req.session.user
  res.render("profile", { user })
})

module.exports = router;
