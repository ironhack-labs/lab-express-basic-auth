const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const { user } = req.session; 
  res.render('index', { user });
});

module.exports = router;
