const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  const data = { title: 'This page is private' };
  res.render('private', data);
});

module.exports = router;
