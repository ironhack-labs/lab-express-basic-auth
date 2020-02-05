const express = require('express');
const router  = express.Router();
const protectRoute = require("../middlewares/protectRoute")


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('');
});

router.get('/main', (req, res, next) => {
  res.render('main');
});


module.exports = router;
