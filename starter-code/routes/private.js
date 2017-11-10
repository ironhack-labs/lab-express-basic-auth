const express = require('express');
const User = require('../models/User');
const path = require("path");
const debug = require('debug')('basic-auth:' + path.basename(__filename));
const router = express.Router();


router.use((req, res, next) => {
  if (req.session.currentUser){
    next();
  }else{
    res.redirect('/login');
  }
});

router.get('/', (req, res) =>{
  res.render('private');
});

module.exports = router;
