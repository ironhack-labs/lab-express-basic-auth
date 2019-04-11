const express = require('express');
const router  = express.Router();
const secure = require('../middleware/secure.mid')


router.get('/', secure.isAuthenticated, (req, res, next) =>{
  res.render('protected.hbs')
})

module.exports = router