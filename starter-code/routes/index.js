const express = require('express');
const router  = new express.Router();
const protectLoginRoute = require('../middlewares/protectLoginRoute')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private', protectLoginRoute, (req,res,next) => {
  res.render('private')
})

router.get('/main', (req,res,next) => {
  res.render('main')
})

module.exports = router;
