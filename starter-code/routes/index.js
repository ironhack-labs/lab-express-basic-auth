const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.session);
  res.render("index", { user: req.session.user });
});

module.exports = router;
