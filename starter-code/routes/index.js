const express = require('express');
const router  = express.Router();
const protectRoute = require("./../middlewares/protectRoute");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

module.exports = router;
