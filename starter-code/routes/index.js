const express = require('express');
const router  = express.Router();

const protectRoute = require("../middlewares/protectRoute");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/dashboard', (req, res, next) => {
  res.render('dashboard');
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/private', protectRoute, (req, res) => {
  res.render('private');
});



module.exports = router;
