const express = require('express');
const router = express.Router();

const protRoutes = require('../middlewares/protRoutes');

router.use(protRoutes);

router.get('/main', (req, res) => {
  console.log('Main page');
  res.render('main');
});

router.get('/private', (req, res) => {
  console.log('Private page');
  res.render('private');
});

module.exports = router;
