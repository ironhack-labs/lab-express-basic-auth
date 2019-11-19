var express = require('express');
var router = express.Router();

// GET '/login'
router.get('/', (req, res, next) => {
  console.log('ENTRO EN LA PAGINA DE LOGIN')
  res.render('auth-views/login');
});

module.exports = router;
