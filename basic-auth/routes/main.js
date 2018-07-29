const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  const data = { title: 'Main' };
  res.render('main', data);
});

module.exports = router;
