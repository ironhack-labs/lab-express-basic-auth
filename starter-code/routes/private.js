const express = require('express');
const router  = express.Router();
const isLogged = require('../helpers/isLogged')
/* GET home page */
router.use(isLogged)

router.get('/', (req, res, next) => {
  res.render('private');
});



module.exports = router;