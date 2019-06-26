const express = require('express');
const router  = express.Router();
const ensureAuthenticated=require("./ensureAuth.js")

/* GET home page */
router.get('/main', ensureAuthenticated, (req, res) => {
  res.render('main');
});

module.exports = router;