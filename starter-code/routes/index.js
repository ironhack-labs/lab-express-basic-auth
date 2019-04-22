require('dotenv').config()

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;


