const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  const data = { title: 'Basic Authentication' };
  res.render('index', data);
});

module.exports = router;
