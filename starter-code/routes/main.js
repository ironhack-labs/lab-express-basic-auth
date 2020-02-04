const express = require('express');
const router  = express.Router();
const protectRoute = require("../middlewares/protectRoute");

router.get('/', protectRoute, (req, res) => {
  res.render('main');
});

module.exports = router;