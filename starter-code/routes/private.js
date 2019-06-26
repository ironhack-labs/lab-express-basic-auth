const express = require('express');
const router  = express.Router();
const ensureAuthenticated=require("./ensureAuth.js")

/* GET home page */
router.get('/private', ensureAuthenticated,  (req, res) => {
  res.render('private');
});


module.exports = router;