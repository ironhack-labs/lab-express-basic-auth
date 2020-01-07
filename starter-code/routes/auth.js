const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('../views/signup.hbs');
})

module.exports = router;