const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/main', (req, res, next) => {
  res.render('main');
});
router.get('/secret', (req, res, next) =>{
  res.render('secret')
})

module.exports = router;
