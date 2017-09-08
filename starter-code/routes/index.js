const express = require('express');
const router = express.Router();
//const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/',(req,res) =>{
  res.render('index');
});

module.exports = router;